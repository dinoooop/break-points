from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.user_list, name='user_list'),
    path('show/<int:pk>/', views.user_show, name='user_show'),
    path('store/', views.user_store, name='user_store'),
    path('update/<int:pk>/', views.user_update, name='user_update'),
    path('delete/<int:pk>/', views.user_delete, name='user_delete'),
]
