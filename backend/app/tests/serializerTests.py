from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from ..serializer import (
    UserRegisterSerializer, 
    UserLoginSerializer, 
    UserSerializer, 
    EventSerializer, 
    EventSubmissionSerializer, 
    EventRegistrationSerializer, 
    CategorySerializer, 
    EventCategorySerializer, 
    TagSerializer, 
    EventTagSerializer
)
from ..models import Event, Event_Submission, Event_Registration, Category, Event_Category, Tag, Event_Tag, EventStatus, SubmissionEnum

User = get_user_model()

class UserRegisterSerializerTest(TestCase):
    def test_create_user(self):
        data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }
        serializer = UserRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, data['username'])
        self.assertEqual(user.email, data['email'])
        self.assertTrue(user.check_password(data['password']))

class UserLoginSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

    def test_login_with_username(self):
        data = {'username': 'testuser', 'password': 'testpass123'}
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['user'], self.user)

    def test_login_with_email(self):
        data = {'email': 'test@example.com', 'password': 'testpass123'}
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['user'], self.user)

    def test_login_missing_credentials(self):
        data = {'password': 'testpass123'}
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())

class UserSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')

    def test_user_serializer(self):
        serializer = UserSerializer(instance=self.user)
        data = serializer.data
        self.assertEqual(data['username'], self.user.username)
        self.assertEqual(data['email'], self.user.email)

class EventSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='organizer', email='organizer@example.com', password='testpass123')
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

    def test_event_serializer(self):
        serializer = EventSerializer(instance=self.event)
        data = serializer.data
        self.assertEqual(data['title'], self.event.title)
        self.assertEqual(data['description'], self.event.description)
        self.assertEqual(data['location'], self.event.location)

class EventSubmissionSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='submitter', email='submitter@example.com', password='testpass123')
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
        self.submission = Event_Submission.objects.create(
            title="Test Submission",
            description="This is a test submission.",
            submitter_ID=self.user.user_ID,
            status=SubmissionEnum.PENDING.value,
            event_ID=self.event,
            user_ID=self.user
        )

    def test_event_submission_serializer(self):
        serializer = EventSubmissionSerializer(instance=self.submission)
        data = serializer.data
        self.assertEqual(data['title'], self.submission.title)
        self.assertEqual(data['description'], self.submission.description)

class EventRegistrationSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass123')
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
        self.registration = Event_Registration.objects.create(event_ID=self.event, user_ID=self.user)

    def test_event_registration_serializer(self):
        serializer = EventRegistrationSerializer(instance=self.registration)
        data = serializer.data
        self.assertEqual(data['event_ID'], self.event.event_ID)
        self.assertEqual(data['user_ID'], self.user.user_ID)

class CategorySerializerTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Test Category")

    def test_category_serializer(self):
        serializer = CategorySerializer(instance=self.category)
        data = serializer.data
        self.assertEqual(data['name'], self.category.name)

class EventCategorySerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='organizer', email='organizer@example.com', password='testpass123')
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
        self.category = Category.objects.create(name="Test Category")
        self.event_category = Event_Category.objects.create(event_ID=self.event, category_ID=self.category)

    def test_event_category_serializer(self):
        serializer = EventCategorySerializer(instance=self.event_category)
        data = serializer.data
        self.assertEqual(data['event_ID'], self.event.event_ID)
        self.assertEqual(data['category_ID'], self.category.category_ID)

class TagSerializerTest(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(name="Test Tag")

    def test_tag_serializer(self):
        serializer = TagSerializer(instance=self.tag)
        data = serializer.data
        self.assertEqual(data['name'], self.tag.name)

class EventTagSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='organizer', email='organizer@example.com', password='testpass123')
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
        self.tag = Tag.objects.create(name="Test Tag")
        self.event_tag = Event_Tag.objects.create(event_ID=self.event, tag_ID=self.tag)

    def test_event_tag_serializer(self):
        serializer = EventTagSerializer(instance=self.event_tag)
        data = serializer.data
        self.assertEqual(data['event_ID'], self.event.event_ID)
        self.assertEqual(data['tag_ID'], self.tag.tag_ID)
