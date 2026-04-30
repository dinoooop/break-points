from django.urls import path

from . import views

urlpatterns = [
    path("", views.break_point_list, name="break_point_list"),
    path("show/<int:pk>/", views.break_point_show, name="break_point_show"),
    path("store/", views.break_point_store, name="break_point_store"),
    path("update/<int:pk>/", views.break_point_update, name="break_point_update"),
    path("delete/<int:pk>/", views.break_point_delete, name="break_point_delete"),
]

