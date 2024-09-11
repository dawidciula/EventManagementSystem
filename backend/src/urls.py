from django.urls import path
from .views import (
    UserRegister,
    UserLogin,
    UserLogout,
    UserView,
    AdminDashboardView,
    EventListView,
    JoinEventView,
    LeaveEventView,
    UserDetail,
    UserDetailById,
    EventSearchAPIView,
)

urlpatterns = [
    # User authentication
    path("register/", UserRegister.as_view(), name="api-register"),
    path("login/", UserLogin.as_view(), name="api-login"),
    path("logout/", UserLogout.as_view(), name="api-logout"),
    # User management
    path("users/", UserView.as_view(), name="api-users"),
    path("users/<int:pk>/", UserView.as_view(), name="api-user-detail"),
    # Admin Dashboard
    path("admin-dashboard/", AdminDashboardView.as_view(), name="api-admin-dashboard"),
    # Events
    path("events/", EventListView.as_view(), name="api-events"),
    path("events/<int:event_id>/", EventListView.as_view(), name="api-event-detail"),
    # Event participation
    path("events/<int:event_id>/join/", JoinEventView.as_view(), name="api-join-event"),
    path(
        "events/<int:event_id>/leave/", LeaveEventView.as_view(), name="api-leave-event"
    ),
    path("user/", UserDetail.as_view(), name="user-detail"),
    path("users-details/<int:user_id>", UserDetailById.as_view(), name="users-details"),
    path("events/search/", EventSearchAPIView.as_view(), name="event_search_api"),
]
