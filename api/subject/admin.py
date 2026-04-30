from django.contrib import admin

from .models import Subject


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "threshold", "created_at", "updated_at")
    list_filter = ("category",)
    search_fields = ("title", "description")
