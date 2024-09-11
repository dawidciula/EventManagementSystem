from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from src.forms import UserEditForm
from src.models import Event
from django.db.models import Q
from .serializer import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSerializer,
    EventRegistrationSerializer,
    EventSerializer,
)
from .validations import custom_validation, validate_email, validate_password
from django.shortcuts import render, redirect
from django.http import HttpResponseServerError
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveDestroyAPIView,
    DestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from rest_framework import viewsets
from django.contrib.auth.models import User
from .forms import EventForm
from .models import Event, Event_Registration
from django.contrib import messages
from django.views import View
from django.views.generic import DetailView
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import generics


# * User views
User = get_user_model()


# * User registration API view
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            validated_data = serializer.validated_data.copy()
            validated_data.pop("csrfmiddlewaretoken", None)
            user = User.objects.create_user(**validated_data)
            return Response(
                {"message": "Registration successful"}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# * User login API view
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# * Details about logged user
class UserDetailById(APIView):
    permission_classes = (permissions.IsAdminUser,)  # Adjust as necessary

    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        registered_events = Event_Registration.objects.filter(
            user_ID=user
        ).select_related("event_ID")
        events_data = EventSerializer(
            [registration.event_ID for registration in registered_events], many=True
        ).data

        user_data = {
            "username": user.username,
            "email": user.email,
            "registered_events": events_data,
        }
        return Response(user_data, status=status.HTTP_200_OK)


class UserDetail(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        # * Events registered
        registered_events = Event_Registration.objects.filter(user_ID=user).values_list(
            "event_ID", flat=True
        )
        user_data = {
            "username": user.username,
            "isAuthenticated": True,
            "isStaff": user.is_staff,
            "registered_events": list(registered_events),
        }
        return Response(user_data, status=status.HTTP_200_OK)


# * User logout API view
class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


# * User API view
class UserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk=None):
        if pk:
            user = get_object_or_404(get_user_model(), pk=pk)
            serializer = UserSerializer(user)
        else:
            users = get_user_model().objects.all()
            serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        user = get_object_or_404(get_user_model(), pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = get_object_or_404(get_user_model(), pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# * AdminDashboard API view
class AdminDashboardView(APIView):
    permission_classes = (permissions.IsAdminUser,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        users = User.objects.all()
        events = Event.objects.all()
        return Response(
            {
                "users": UserSerializer(users, many=True).data,
                "events": EventSerializer(events, many=True).data,
            }
        )

    def post(self, request):
        event_form = EventForm(request.data)
        if event_form.is_valid():
            event_form.save()
            return Response(
                {"message": "Event created successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(event_form.errors, status=status.HTTP_400_BAD_REQUEST)


# * Event List API view
class EventListView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, event_id=None):
        if event_id:
            event = get_object_or_404(Event, pk=event_id)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        else:
            events = Event.objects.all()
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        event.delete()
        return Response(
            {"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT
        )


# * Event join API view
class JoinEventView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, event_id):
        # Use 'event_ID' to query the Event model
        event = get_object_or_404(Event, event_ID=event_id)
        # Ensure the field names are correctly used
        if not Event_Registration.objects.filter(
            event_ID=event, user_ID=request.user
        ).exists():
            Event_Registration.objects.create(event_ID=event, user_ID=request.user)
            return Response(
                {"message": f"You have been signed up for the event: {event.title}"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": f"You have already signed up for the event: {event.title}"},
            status=status.HTTP_400_BAD_REQUEST,
        )


# * Leave API view
class LeaveEventView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, event_id):
        # Use 'event_ID' to query the Event model
        event = get_object_or_404(Event, event_ID=event_id)
        # Ensure the field names are correctly used
        registration = get_object_or_404(
            Event_Registration, event_ID=event, user_ID=request.user
        )
        registration.delete()
        return Response(
            {"message": f"You have been written out of the event: {event.title}"},
            status=status.HTTP_200_OK,
        )


class EventSearchAPIView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = permissions.AllowAny

    def get_queryset(self):
        query = self.request.GET.get("q", "")
        if query:

            return Event.objects.filter(
                Q(title__icontains=query)
                | Q(description__icontains=query)
                | Q(location__icontains=query)
            )
        return Event.objects.none()
