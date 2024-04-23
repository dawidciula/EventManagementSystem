from rest_framework  import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_ID', 
                  'username', 
                  'email', 
                  'role']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_ID', 
                  'title', 
                  'date', 
                  'description', 
                  'start_date', 
                  'end_date', 
                  'location', 
                  'organizer_ID', 
                  'parent_event_ID', 
                  'status']

class EventSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Submission
        fields = ['submission_ID', 
                  'event_ID', 
                  'title', 
                  'description', 
                  'submitter_ID', 
                  'status']

class EventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Registration
        fields = ['registration_ID', 
                  'event_ID', 
                  'user_ID', 
                  'registration_Date']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_ID', 
                  'name']

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Category
        fields = ['event_ID', 
                  'category_ID']
        #* Creating pk for two fields
        constraints = [models.UniqueConstraint(fields=['event_ID', 'category_ID'], name='EventCategory_pk')]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_ID', 
                  'name']

class EventTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event_Tag
        fields = ['event_ID', 
                  'tag_ID']
        #* Creating pk for two fields
        constraints = [models.UniqueConstraint(fields=['event_ID', 'tag_ID'], name='EventTag_pk')]