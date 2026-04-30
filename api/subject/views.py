from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import OuterRef, Subquery

from assist.utils.CustomPagination import CustomPagination
from .models import Subject
from .serializers import SubjectSerializer
from break_point.models import BreakPoint


@api_view(["GET"])
def subject_list(request):
    subjects = Subject.objects.all().order_by('-id')

    category_id = request.GET.get("category_id")
    if category_id:
        subjects = subjects.filter(category_id=category_id)

    paginator = CustomPagination()
    result_page = paginator.paginate_queryset(subjects, request)
    serializer = SubjectSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def subject_show(request, pk):
    try:
        subject = Subject.objects.select_related("category").get(pk=pk)
    except Subject.DoesNotExist:
        return Response({"detail": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = SubjectSerializer(subject)
    return Response(serializer.data)


@api_view(["POST"])
def subject_store(request):
    serializer = SubjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT", "PATCH"])
def subject_update(request, pk):
    try:
        subject = Subject.objects.get(pk=pk)
    except Subject.DoesNotExist:
        return Response({"detail": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)

    partial = request.method == "PATCH"
    serializer = SubjectSerializer(subject, data=request.data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
def subject_delete(request, pk):
    try:
        subject = Subject.objects.get(pk=pk)
    except Subject.DoesNotExist:
        return Response({"detail": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)
    subject.delete()
    return Response({"message": "Subject deleted"}, status=status.HTTP_204_NO_CONTENT)
