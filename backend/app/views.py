from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from .forms import UserEditForm, EventForm
from .models import Event, Event_Registration
from .serializer import (
    EventRegistrationSerializer, UserRegisterSerializer, UserLoginSerializer,
    UserSerializer, EventSerializer
)
from django.contrib import messages
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets

User = get_user_model()


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data.copy()
            validated_data.pop('csrfmiddlewaretoken', None)
            user = User.objects.create_user(**validated_data)
            return redirect('/login')
        else:
            return render(request, 'register.html', {'error': 'Registration failed'})


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            if user.is_superuser:
                return redirect('/start')
            else:
                return redirect('/start')  
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        logout(request)
        return redirect('home')

    def post(self, request):
        logout(request)
        return redirect('home')


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk=None):
        if pk:
            user = get_object_or_404(User, pk=pk)
            serializer = UserSerializer(user)
        else:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def home_view(request):
    return render(request, 'home.html')


@login_required
@csrf_exempt
def admin_dashboard(request):
    users = User.objects.all()
    events = Event.objects.all()
    
    if request.method == 'POST':
        event_form = EventForm(request.POST)
        if event_form.is_valid():
            event_form.save()
            return redirect('admin_dashboard')
    else:
        event_form = EventForm()
    
    return render(request, 'admin_dashboard.html', {'users': users, 'events': events, 'event_form': event_form})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@login_required
@csrf_exempt
def edit_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    if request.method == 'POST':
        user_form = UserEditForm(request.POST, instance=user)
        if user_form.is_valid():
            user_form.save()
            return redirect('user_detail', user_id=user_id)
    else:
        user_form = UserEditForm(instance=user)

    return render(request, 'edit_user.html', {'user_form': user_form, 'user_id': user_id})


@login_required
def delete_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user.delete()
    return redirect('admin_dashboard')


@login_required
def user_detail(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    events_joined = Event_Registration.objects.filter(user_ID=user)
    return render(request, 'user_detail.html', {'user': user, 'events_joined': events_joined})


@login_required
@csrf_exempt
def edit_event(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    if request.method == 'POST':
        event_form = EventForm(request.POST, instance=event)
        if event_form.is_valid():
            event_form.save()
            return redirect('admin_dashboard')
    else:
        event_form = EventForm(instance=event)
    return render(request, 'edit_event.html', {'event_form': event_form, 'event_id': event_id})



@login_required
@csrf_exempt
def delete_event(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    event.delete()
    return JsonResponse({'message': 'Event deleted successfully'})


@login_required
@csrf_exempt
def create_event(request):
    if request.method == 'POST':
        event_form = EventForm(request.POST)
        if event_form.is_valid():
            event_form.save()
            return redirect('admin_dashboard')
    else:
        event_form = EventForm()
    return render(request, 'create_event.html', {'event_form': event_form})


class JoinEventView(View):
    def post(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        if not Event_Registration.objects.filter(event_ID=event, user_ID=request.user).exists():
            Event_Registration.objects.create(event_ID=event, user_ID=request.user)
            messages.success(request, f'You have been signed up for the event: {event.title}')
        return redirect('events')


class LeaveEventView(View):
    def post(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        registration = get_object_or_404(Event_Registration, event_ID=event, user_ID=request.user)
        registration.delete()
        messages.success(request, f'You have been written out of the event: {event.title}')
        return redirect('events')


class EventView(APIView):
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
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class EventListView(APIView):
    def get(self, request):
        events =Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    

class EventDetailView(View):
    def get(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        is_registered = False
        if request.user.is_authenticated:
            is_registered = Event_Registration.objects.filter(event_ID=event, user_ID=request.user).exists()
        
        context = {
            'event': event,
            'is_registered': is_registered,
        }
        return render(request, 'event_detail.html', context)

