from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated


# Helper function to generate JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
def register(request):
    full_name = request.data.get('full_name', '').strip()
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')
    confirm_password = request.data.get('confirm_password', '')

    # Validation
    if not all([full_name, email, password, confirm_password]):
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'error': 'Email is already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    # Create new user
    user = User.objects.create(
        username=email,
        email=email,
        first_name=full_name,
        password=make_password(password)
    )

    tokens = get_tokens_for_user(user)

    return Response({
        'message': 'Registration successful.',
        'user': {
            'id': user.id,
            'full_name': user.first_name,
            'email': user.email,
            'avatar': user.profile.avatar if hasattr(user, 'profile') else None
        },
        'tokens': tokens
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    email = request.data.get('email', '').strip().lower()
    password = request.data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=email, password=password)
    if user is None:
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    tokens = get_tokens_for_user(user)

    return Response({
        'message': 'Login successful.',
        'user': {
            'id': user.id,
            'full_name': user.first_name,
            'email': user.email,
            'is_staff': user.is_staff,
            'avatar': user.profile.avatar if hasattr(user, 'profile') else None
        },
        'tokens': tokens
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check(request):
    try:
        user = request.user
        user_id = user.id
        return Response({
            'user': {
                'username': user.username,
                'email': user.email,
                'id': user_id,
            },
            'userId': user_id
        }, status=status.HTTP_200_OK)
    except Exception as err:
        print(err)
        return Response({'message': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

