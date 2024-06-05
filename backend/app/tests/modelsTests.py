from django.test import TestCase
from ..models import User, Event, EventStatus, Event_Submission, Event_Registration, Category, Event_Category, Tag, Event_Tag, SubmissionEnum
from django.utils import timezone

class UserModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, "test@example.com")
        self.assertEqual(self.user.username, "testuser")
        self.assertTrue(self.user.check_password("testpass123"))

    def test_create_superuser(self):
        superuser = User.objects.create_superuser(
            email="admin@example.com",
            username="adminuser",
            password="adminpass123"
        )
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)



class EventModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="organizer@example.com",
            username="organizer",
            password="organizerpass"
        )
        self.event = Event.objects.create(
            title="Test Event",
            date=timezone.now().date(),
            description="This is a test event.",
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1),
            location="Test Location",
            status=EventStatus.PLANNED.value,
            organizer_ID=self.user
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, "Test Event")
        self.assertEqual(self.event.description, "This is a test event.")
        self.assertEqual(self.event.status, EventStatus.PLANNED.value)
        self.assertEqual(self.event.organizer_ID, self.user)


    def test_event_with_parent(self):
        parent_event = Event.objects.create(
            title="Parent Event",
            date=timezone.now().date(),
            description="This is the parent event.",
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1),
            location="Parent Location",
            status=EventStatus.PLANNED.value,
            organizer_ID=self.user
        )
        child_event = Event.objects.create(
            title="Child Event",
            date=timezone.now().date(),
            description="This is the child event.",
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1),
            location="Child Location",
            status=EventStatus.PLANNED.value,
            organizer_ID=self.user,
            parent_event_ID=parent_event
        )
        self.assertEqual(child_event.parent_event_ID, parent_event)


class EventSubmissionModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="submitter@example.com",
            username="submitter",
            password="submitterpass"
        )
        self.event = Event.objects.create(
            title="Test Event",
            date=timezone.now().date(),
            description="This is a test event.",
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1),
            location="Test Location",
            status=EventStatus.PLANNED.value,
            organizer_ID=self.user
        )

    def test_event_submission_creation(self):
        event_submission = Event_Submission.objects.create(
            title="Test Submission",
            description="This is a test submission.",
            submitter_ID=self.user.user_ID,
            status=SubmissionEnum.PENDING.value,
            event_ID=self.event,
            user_ID=self.user
        )
        self.assertEqual(event_submission.title, "Test Submission")


class EventRegistrationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            username="testuser",
            password="testpass123"
        )

        self.event = Event.objects.create(
            title="Test Event",
            date=timezone.now().date(),
            description="This is a test event.",
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1),
            location="Test Location",
            status="Planned",
            organizer_ID=self.user
        )

    def test_event_registration_creation(self):
        registration = Event_Registration.objects.create(
            event_ID=self.event,
            user_ID=self.user
        )

        self.assertEqual(registration.event_ID, self.event)
        self.assertEqual(registration.user_ID, self.user)
        self.assertIsNotNone(registration.registration_Date)  
