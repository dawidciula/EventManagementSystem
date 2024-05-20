from django.conf.urls import include
from django.middleware import csrf
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from rest_framework import views
from app.views import EventView, UserRegister, UserLogin, UserViewSet, UserLogout, UserView, home_view, admin_dashboard, edit_user, delete_user, user_detail
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')


urlpatterns = [
    path('', include(router.urls)),
    path('start/', home_view, name='home'),
    
    path('events/', EventView.as_view(), name='events'),
    path('events/<int:pk>/', EventView.as_view(), name='event_detail'),
    
    path('register/', UserRegister.as_view(), name='register'),
    path('login/', UserLogin.as_view(), name='login'),
    path('logout/', UserLogout.as_view(), name='logout'),
    
    path('users/<int:pk>/', UserView.as_view(), name='user_detail'),
    path('edit_user/<int:user_id>/', edit_user, name='edit_user'),
    path('delete_user/<int:user_id>/', delete_user, name='delete_user'),
    path('user_detail/<int:user_id>/', user_detail, name='user_detail'),
    
    path('dashboard/', admin_dashboard, name='admin_dashboard'),
]
