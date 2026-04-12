from django.urls import path
from . import views

urlpatterns = [
    path('', views.category_list, name='category_list'),
    path('show/<int:pk>/', views.category_show, name='category_show'),
    path('store/', views.category_store, name='category_store'),
    path('update/<int:pk>/', views.category_update, name='category_update'),
    path('delete/<int:pk>/', views.category_delete, name='category_delete'),
]
