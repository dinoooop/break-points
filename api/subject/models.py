from django.db import models
from django.utils.timezone import now
from category.models import Category


class Subject(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subjects")
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    mode = models.CharField(max_length=50, null=False, default="date_type") # can be date_type or reading_type
    threshold = models.IntegerField(blank=True, null=False, default=0)
    last_end_date = models.DateField(blank=True, null=True)
    last_end_reading = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=20, null=False, default="active") # active, archived
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
