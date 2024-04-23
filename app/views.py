from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
# Create your views here.


class ReactView(APIView):

    serializer_class = UserSerializer

    def get(self, request):
        output = [{"user_ID": output.user_ID, "username": output.username,"email":output.email,"role":output.role}
                  for output in User.objects.all()]
        return Response(output)

    def post(self, request):

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)