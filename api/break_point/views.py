from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from assist.utils.mark import update_current_bp_counts, update_subject_category_for_bp_changes

from assist.utils.CustomPagination import CustomPagination
from .models import BreakPoint
from .serializers import BreakPointSerializer
from subject.models import Subject


@api_view(["GET"])
def break_point_list(request):
    break_points = BreakPoint.objects.select_related("subject").all().order_by("-id")

    subject_id = request.GET.get("subject_id")
    if subject_id:
        break_points = break_points.filter(subject_id=subject_id)

    paginator = CustomPagination()
    result_page = paginator.paginate_queryset(break_points, request)
    serializer = BreakPointSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def break_point_show(request, pk):
    try:
        break_point = BreakPoint.objects.select_related("subject").get(pk=pk)
    except BreakPoint.DoesNotExist:
        return Response({"detail": "Break point not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = BreakPointSerializer(break_point)
    return Response(serializer.data)


@api_view(["POST"])
def break_point_store(request):
    request_data = request.data.copy()
    subject_id = request_data.get("subject")
    subject = Subject.objects.select_related("category").get(pk=subject_id)


    last_bp = BreakPoint.objects.filter(subject=subject).order_by("-id").first()
    
    if subject.mode == 'date_type':
        # Validate input
        if request_data.get("end_date") is None:
            request_data["end_date"] = datetime.today().strftime("%Y-%m-%d")
        
        # check new end_date is not before the last break point's end_date
        if last_bp is not None:
            new_end_date = datetime.strptime(request_data["end_date"], "%Y-%m-%d").date()
            if new_end_date < last_bp.end_date:
                return Response({"detail": "end_date cannot be before the last break point's end_date"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # validate input for READING_TYPE
        if request_data.get("end_reading") is None:
            request_data["end_reading"] = subject.category.category_current_reading
        if request_data.get("reading_date") is None:
            request_data["reading_date"] = datetime.today().strftime("%Y-%m-%d")
        # check new end_reading is greater than previous bp end_reading
        if last_bp is not None:
            last_bp_end_reading = last_bp.end_reading
            new_end_reading = int(request_data["end_reading"])
            if new_end_reading < last_bp_end_reading:
                return Response({"detail": "end_reading cannot be less than the last break point's end_reading"}, status=status.HTTP_400_BAD_REQUEST)
            
    serializer = BreakPointSerializer(data=request_data)
    if serializer.is_valid():
        current_bp = serializer.save()
        update_current_bp_counts(current_bp, subject)
        update_subject_category_for_bp_changes(subject)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "PATCH"])
def break_point_update(request, pk):
    request_data = request.data.copy()
    # request_data.pop("subject", None)
    
    try:
        
        current_bp = BreakPoint.objects.select_related("subject").get(pk=pk)
        # request_data['suubject'] = current_bp.subject.id
        subject = Subject.objects.select_related("category").get(pk=current_bp.subject.id)


        # Validateion start
        prev_bp = BreakPoint.objects.filter(
            subject=current_bp.subject,
            id__lt=current_bp.id
        ).order_by("-id").first()

        next_bp = BreakPoint.objects.filter(
            subject=current_bp.subject,
            id__gt=current_bp.id
        ).order_by("id").first()
        
        if subject.mode == 'date_type':
            if prev_bp is not None:
                new_end_date = datetime.strptime(request_data["end_date"], "%Y-%m-%d").date()
            if new_end_date < prev_bp.end_date:
                return Response({"detail": "end_date cannot be before the prev break point's end_date"}, status=status.HTTP_400_BAD_REQUEST)
            if next_bp is not None:
                new_end_date = datetime.strptime(request_data["end_date"], "%Y-%m-%d").date()
                if new_end_date > next_bp.end_date:
                    return Response({"detail": "end_date cannot be after the next break point's end_date"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if prev_bp is not None:
                new_end_reading = int(request_data["end_reading"])
                if new_end_reading < prev_bp.end_reading:
                    return Response({"detail": "end_reading cannot be less than the prev break point's end_reading"}, status=status.HTTP_400_BAD_REQUEST)
            if next_bp is not None:
                new_end_reading = int(request_data["end_reading"])
                if new_end_reading > next_bp.end_reading:
                    return Response({"detail": "end_reading cannot be greater than the next break point's end_reading"}, status=status.HTTP_400_BAD_REQUEST)
    except BreakPoint.DoesNotExist:
        return Response({"detail": "Break point not found"}, status=status.HTTP_404_NOT_FOUND)

    partial = request.method == "PATCH"
    serializer = BreakPointSerializer(current_bp, data=request_data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        update_current_bp_counts(current_bp, subject)
        # if next_bp is not none, then its cv, rm, ex will be based on the current bp's end_date, so we need to update it as well
        if next_bp is not None:
            update_current_bp_counts(next_bp, subject)
        
        update_subject_category_for_bp_changes(subject)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def break_point_delete(request, pk):
    try:
        bp_to_delete = BreakPoint.objects.select_related("subject").get(pk=pk)
    except BreakPoint.DoesNotExist:
        return Response({"detail": "Break point not found"}, status=status.HTTP_404_NOT_FOUND)
    
    subject = bp_to_delete.subject
    bp_to_delete.delete()
    
    # Ensure the last break point of this subject reflects the subject's last_end_date
    last_bp = BreakPoint.objects.filter(subject=subject).order_by("-id").first()
    
    if bp_to_delete.id == last_bp.id:
        # If the deleted break point is the last one, update the subject's last_end_date 
        if last_bp is not None:
            subject.last_end_date = last_bp.end_date
            subject.save(update_fields=["last_end_date"])
        else:
            subject.last_end_date = None
            subject.save(update_fields=["last_end_date"])
    return Response({"message": "Break point deleted"}, status=status.HTTP_204_NO_CONTENT)
