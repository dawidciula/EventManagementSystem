from django import forms
from django.contrib.auth.models import User
from .models import Event, User, EventStatus


# formularz dla uzytkownika
class UserEditForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["username", "email"]
        widgets = {
            "username": forms.TextInput(attrs={"class": "form-control"}),
            "email": forms.EmailInput(attrs={"class": "form-control"}),
        }


# formularz dla wydarzen
class EventForm(forms.ModelForm):
    date = forms.DateField(
        widget=forms.DateInput(
            attrs={"type": "date", "class": "form-control"}, format="%Y-%m-%d"
        )
    )
    start_date = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={"type": "datetime-local", "class": "form-control"},
            format="%Y-%m-%dT%H:%M",
        )
    )
    end_date = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={"type": "datetime-local", "class": "form-control"},
            format="%Y-%m-%dT%H:%M",
        )
    )

    class Meta:
        model = Event
        fields = [
            "title",
            "date",
            "description",
            "start_date",
            "end_date",
            "location",
            "status",
            "organizer_ID",
            "image",
            "parent_event_ID",
        ]
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control"}),
            "location": forms.TextInput(attrs={"class": "form-control"}),
            "status": forms.Select(attrs={"class": "form-select"}),
            "organizer_ID": forms.Select(attrs={"class": "form-select"}),
            "parent_event_ID": forms.Select(attrs={"class": "form-select"}),
            "image": forms.FileInput(attrs={"class": "form-control"}),
        }
