from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'description', 'audio_file', 'created_at', 'user']
        read_only_fields = ['user', 'created_at']