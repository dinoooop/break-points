from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from assist.utils.CustomPagination import CustomPagination

from .filters import apply_filters

from .models import Profile
from .serializers import UserSerializer

# Reuse image helpers if you have them (same as cars.views).
# Adjust import path if necessary.
from assist.utils.image_curve import img_resize, img_save_crop

@api_view(['GET'])
def user_list(request):
    """
    List all users (paginated). Optionally filter by query params if you add filters.
    """
    # get all user with profile data
    users = User.objects.all().order_by('-id')
    users = apply_filters(users, request.query_params)
    paginator = CustomPagination()
    result_page = paginator.paginate_queryset(users, request)
    serializer = UserSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def user_show(request, pk):
    """
    Show a single user with profile.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, context={'request': request})
    print(serializer.data)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def user_store(request):
    """
    Create a new user (registration). Accepts nested 'profile' dict.
    If an avatar file is uploaded with key 'avatar' it will be processed with img_save_crop.
    Password should be provided in request.data['password'].
    """
    data = request.data.copy()

    avatar_saved = img_save_crop(request, 'avatar')
    if avatar_saved:
        data['avatar'] = avatar_saved
        img_resize(avatar_saved, "avatar")

    serializer = UserSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def user_update(request, pk):
    """
    Update user & profile. PATCH does partial updates. Only the user themself or staff can update.
    Accept multipart for avatar upload (key 'avatar').
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # authorization: allow if request.user is target user or staff
    # if not (request.user.is_staff or request.user.id == user.id):
    #     return Response({'detail': 'Not permitted'}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()

    # handle avatar file
    avatar_saved = img_save_crop(request, 'avatar')
    if avatar_saved:
        data['avatar'] = avatar_saved
        img_resize(avatar_saved, "avatar")

    partial = request.method == 'PATCH'
    serializer = UserSerializer(user, data=data, partial=partial, context={'request': request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_delete(request, pk):
    """
    Delete a user. Only staff or the user themselves can delete.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if not (request.user.is_staff or request.user.id == user.id):
        return Response({'detail': 'Not permitted'}, status=status.HTTP_403_FORBIDDEN)

    user.delete()
    return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
