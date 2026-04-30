from django.db import models
from django.utils.timezone import now

from subject.models import Subject


class BreakPoint(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="break_points")
    end_date = models.DateField(blank=True, null=True)
    end_reading = models.IntegerField(blank=True, null=True)
    reading_date = models.DateField(blank=True, null=True)
    # A short note
    description = models.TextField(blank=True, null=True)
    # threshold
    th = models.IntegerField(blank=True, null=False, default=0)
    # current value; 
    cv = models.IntegerField(blank=True, null=False, default=0) 
    # remaining no. of days/reading to go 
    rm = models.IntegerField(blank=True, null=False, default=0)
    # exceeded no. of days/reading
    ex = models.IntegerField(blank=True, null=False, default=0)
    
    class Meta:
         db_table = "break_point_break_points"
    


