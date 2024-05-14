from django.contrib import admin
from django.urls import path, include
from app.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("Event", EventView.as_view(), name="Event"),
    path("User", UserView.as_view(), name="User"),
    # * Authentication
    path("Register", UserRegister.as_view(), name="Register"),
    path("Login/", UserLogin.as_view(), name="Login"),
    path("Logout", UserLogout.as_view(), name="Logout"),
    path("User", UserView.as_view(), name="User"),
    # * Google authentication
    path("accounts/", include("allauth.urls")),
]
