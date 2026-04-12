from django.urls import path, include
from .views import register, login, check



urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('check/', check, name='check'),
]
