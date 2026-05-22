from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from assist.utils.image_curve import img_resize, img_save_crop
from .models import Category
from .serializers import CategorySerializer
from assist.utils.CustomPagination import CustomPagination

@api_view(['GET'])
def category_list(request):
    # get category based on user
    categories = Category.objects.filter(user=request.user).order_by('-id')
    paginator = CustomPagination()
    result_page = paginator.paginate_queryset(categories, request)
    serializer = CategorySerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def category_show(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['POST'])
def category_store(request):
    data = request.data.copy()
    data['user'] = request.user.id
    data["cover"] = img_save_crop(request, 'cover')
    if data["cover"]:
        img_resize(data["cover"], "cover_category")
    serializer = CategorySerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def category_update(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    
    data = request.data.copy()
    data["cover"] = img_save_crop(request, 'cover')
    if data["cover"]:
        img_resize(data["cover"], "cover_category")

    partial = request.method == "PATCH"
    serializer = CategorySerializer(category, data=data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def category_delete(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    category.delete()
    return Response({'message': 'Category deleted'}, status=status.HTTP_204_NO_CONTENT)
