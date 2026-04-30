from django.urls import path

from . import views

urlpatterns = [
    path("", views.subject_list, name="subject_list"),
    path("show/<int:pk>/", views.subject_show, name="subject_show"),
    path("store/", views.subject_store, name="subject_store"),
    path("update/<int:pk>/", views.subject_update, name="subject_update"),
    path("delete/<int:pk>/", views.subject_delete, name="subject_delete"),
]

