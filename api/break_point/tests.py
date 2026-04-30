from rest_framework.test import APITestCase

from category.models import Category
from subject.models import Subject
from .models import BreakPoint


class BreakPointApiTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(title="Category 1")
        self.subject = Subject.objects.create(
            category=self.category,
            title="Math",
            description="Basic math",
            threshold=10,
        )

    def test_break_point_list(self):
        BreakPoint.objects.create(subject=self.subject, status="active", th=1, cv=1)
        response = self.client.get("/api/break_points/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(len(response.data["results"]), 1)

    def test_break_point_list_filter_by_subject_id(self):
        other_subject = Subject.objects.create(
            category=self.category,
            title="Physics",
            description="Basic physics",
            threshold=5,
        )
        BreakPoint.objects.create(subject=self.subject, status="active", th=1, cv=1)
        BreakPoint.objects.create(subject=other_subject, status="active", th=2, cv=2)

        response = self.client.get(f"/api/break_points/?subject_id={self.subject.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["subject"], self.subject.id)

    def test_break_point_store(self):
        payload = {
            "subject": self.subject.id,
            "status": "active",
            "th": 10,
            "cv": 3,
        }
        response = self.client.post("/api/break_points/store/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["subject"], self.subject.id)
        self.assertEqual(response.data["status"], "active")

    def test_break_point_update(self):
        bp = BreakPoint.objects.create(subject=self.subject, status="active", th=1, cv=1)

        payload = {
            "subject": self.subject.id,
            "status": "inactive",
            "th": 2,
            "cv": 2,
        }
        response = self.client.put(f"/api/break_points/update/{bp.id}/", payload, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "inactive")
        self.assertEqual(response.data["th"], 2)
        self.assertEqual(response.data["cv"], 2)

    def test_break_point_delete(self):
        bp = BreakPoint.objects.create(subject=self.subject, status="active", th=1, cv=1)
        response = self.client.delete(f"/api/break_points/delete/{bp.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(BreakPoint.objects.filter(id=bp.id).exists())
