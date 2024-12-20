from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Note
from .serializers import NoteSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class NoteViewSet(ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can access this endpoint

    def get_queryset(self):
        # This ensures that users only see their own notes
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # print(f"Note created: {serializer.instance.title}")
        serializer.save(user=self.request.user)