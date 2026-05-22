from django.db import models

class Category(models.Model):
    user = models.ForeignKey('auth.User', related_name='categories', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    category_current_reading = models.IntegerField(blank=True, null=False, default=0)
    description = models.TextField(blank=True, null=True)
    cover = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
