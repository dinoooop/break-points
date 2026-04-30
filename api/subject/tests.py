from rest_framework.test import APITestCase

from break_point.models import BreakPoint
from category.models import Category
from subject.models import Subject


class SubjectApiTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(title="Category 1")
        self.subject = Subject.objects.create(
            category=self.category,
            title="Math",
            description="Basic math",
            threshold=10,
        )

    def test_subject_list(self):
        response = self.client.get("/api/subjects/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertIn("last_break_point", response.data["results"][0])
        self.assertEqual(response.data["results"][0]["last_break_point"], {})

    def test_subject_list_last_break_point_is_latest(self):
        first = BreakPoint.objects.create(subject=self.subject, status="active", th=1, cv=1)
        last = BreakPoint.objects.create(subject=self.subject, status="active", th=2, cv=2)

        response = self.client.get("/api/subjects/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["last_break_point"]["id"], last.id)
        self.assertNotEqual(response.data["results"][0]["last_break_point"]["id"], first.id)

    def test_subject_store(self):
        payload = {
            "category": self.category.id,
            "title": "Physics",
            "description": "Basic physics",
            "threshold": 5,
        }
        response = self.client.post("/api/subjects/store/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "Physics")
