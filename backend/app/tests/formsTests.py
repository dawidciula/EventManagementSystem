from django.test import TestCase
from django.contrib.auth import get_user_model
from ..forms import UserEditForm, EventForm
from ..models import Event, EventStatus
from django.utils import timezone

User = get_user_model()

class UserEditFormTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_edit_form_fields(self):
        form = UserEditForm(instance=self.user)
        self.assertIn('username', form.fields)
        self.assertIn('email', form.fields)

    def test_user_edit_form_initial_data(self):
        form = UserEditForm(instance=self.user)
        self.assertEqual(form.initial['username'], 'testuser')
        self.assertEqual(form.initial['email'], 'test@example.com')


class EventFormTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='organizer',
            email='organizer@example.com',
            password='organizerpass'
        )
        self.event = Event.objects.create(
            title='Test Event',
            date=timezone.now().date(),
            description='This is a test event.',
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(hours=1),
            location='Test Location',
            status=EventStatus.PLANNED.value,
            organizer_ID=self.user
        )

    def test_event_form_fields(self):
        form = EventForm()
        self.assertIn('title', form.fields)
        self.assertIn('date', form.fields)
        self.assertIn('description', form.fields)
        self.assertIn('start_date', form.fields)
        self.assertIn('end_date', form.fields)
        self.assertIn('location', form.fields)
        self.assertIn('status', form.fields)
        self.assertIn('organizer_ID', form.fields)
        self.assertIn('parent_event_ID', form.fields)

    def test_event_form_initial_data(self):
        form = EventForm(instance=self.event)
        self.assertEqual(form.initial['title'], 'Test Event')
        self.assertEqual(form.initial['date'], self.event.date)
        self.assertEqual(form.initial['description'], 'This is a test event.')
        self.assertEqual(form.initial['start_date'], self.event.start_date)
        self.assertEqual(form.initial['end_date'], self.event.end_date)
        self.assertEqual(form.initial['location'], 'Test Location')
        self.assertEqual(form.initial['status'], EventStatus.PLANNED.value)
        self.assertEqual(form.initial['organizer_ID'], self.event.organizer_ID.user_ID)
        self.assertEqual(form.initial['parent_event_ID'], self.event.parent_event_ID)
