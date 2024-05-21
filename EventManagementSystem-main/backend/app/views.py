from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from app.forms import UserEditForm
from .models import Event
from .serializer import EventRegistrationSerializer, UserRegisterSerializer, UserLoginSerializer, UserSerializer, EventSerializer
from .validations import custom_validation, validate_email, validate_password
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponseServerError
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView,
    DestroyAPIView
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from rest_framework import viewsets
from django.contrib.auth.models import User
from .forms import EventForm




#rejestracja uzytkownikow
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
        

#logowanie uzytkownikow
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



#wylogowywanie uzytkowwnikow
class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        logout(request)
        return redirect('home')

    def post(self, request):
        logout(request)
        return redirect('home')


#uzytkownicy
class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
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
    

#wydarzenia
class EventView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk=None):
        if pk:
            event = get_object_or_404(Event, pk=pk)
            serializer = EventSerializer(event)
        else:
            events = Event.objects.all()
            return render(request, 'events.html', {'events': events})

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
    def delete(self, request, pk):
        event = get_object_or_404(Event, pk=pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


#strona startowa
def home_view(request):
    return render(request, 'home.html')



#panel administratora
def admin_check(user):
    return user.is_superuser

@login_required
@csrf_exempt
def admin_dashboard(request):
    User = get_user_model()
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


#edycja uzytkownika
@login_required
@csrf_exempt
def edit_user(request, user_id):
    user = get_object_or_404(get_user_model(), pk=user_id)
    if request.method == 'POST':
        user_form = UserEditForm(request.POST, instance=user)
        if user_form.is_valid():
            user_form.save()
            return redirect('user_detail', user_id=user_id)
    else:
        user_form = UserEditForm(instance=user)

    return render(request, 'edit_user.html', {'user_form': user_form, 'user_id': user_id})

#usuwanie uzytkownika
@login_required
def delete_user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user.delete()
    return redirect('admin_dashboard')

#detale uzytkownika
@login_required
def user_detail(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    return render(request, 'user_detail.html', {'user': user})




#edycja wydarzenia
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

#usuwanie wydarzenia
@login_required
@csrf_exempt
def delete_event(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    event.delete()
    return redirect('admin_dashboard')

#tworzenie wydarzenia
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



