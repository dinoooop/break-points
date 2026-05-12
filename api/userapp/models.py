from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=15, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    avatar = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.user.username