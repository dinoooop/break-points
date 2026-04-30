from rest_framework import serializers

from subject.models import Subject
from subject.serializers import SubjectSerializer

from .models import BreakPoint


class SubjectNestedPrimaryKeyField(serializers.PrimaryKeyRelatedField):
    def use_pk_only_optimization(self):
        return False

    def to_representation(self, value):
        return SubjectSerializer(value, context=self.context).data


class BreakPointSerializer(serializers.ModelSerializer):
    subject = SubjectNestedPrimaryKeyField(queryset=Subject.objects.select_related("category").all())

    class Meta:
        model = BreakPoint
        fields = "__all__"
