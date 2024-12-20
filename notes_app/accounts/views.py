from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth.hashers import make_password

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already exists.")

        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already registered.")

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)  # Hash the password
        )

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
