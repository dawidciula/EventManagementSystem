from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

# ? UserModel is the user model that is used in the project


UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = "__all__"

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(
            email=clean_data["email"], password=clean_data["password"]
        )
        user_obj.username = clean_data["username"]
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    ##
    def check_user(self, clean_data):
        user = authenticate(
            username=clean_data["email"], password=clean_data["password"]
        )
        if not user:
            raise ValidationError("user not found")
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ("email", "username")


"""
#? UserSerializer but without register authentication
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_ID", "username", "email"]


#! Might not be needed and just should fetched with user
class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ["user_ID", "role"]
"""


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "event_ID",
            "title",
            "date",
            "description",
            "start_date",
            "end_date",
            "location",
            "organizer_ID",
            "parent_event_ID",
            "status",
        ]


class EventSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Submission
        fields = [
            "submission_ID",
            "event_ID",
            "title",
            "description",
            "submitter_ID",
            "status",
        ]


class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Registration
        fields = ["registration_ID", "event_ID", "user_ID", "registration_Date"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["category_ID", "name"]


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Category
        fields = ["event_ID", "category_ID"]
        # * Creating pk for two fields
        constraints = [
            models.UniqueConstraint(
                fields=["event_ID", "category_ID"], name="EventCategory_pk"
            )
        ]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["tag_ID", "name"]


class EventTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Tag
        fields = ["event_ID", "tag_ID"]
        # * Creating pk for two fields
        constraints = [
            models.UniqueConstraint(fields=["event_ID", "tag_ID"], name="EventTag_pk")
        ]
