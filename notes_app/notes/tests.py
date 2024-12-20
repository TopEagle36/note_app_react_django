from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from notes.models import Note

class NoteCreationTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        
        # Generate a token for the user
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Set up API client
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        self.note_url = '/api/notes/notes/'
    
    def test_create_note_with_audio(self):
        with open('test_audio.wav', 'wb') as f:
            f.write(b'Test audio file content')  # Create a mock audio file
        
        with open('test_audio.wav', 'rb') as audio:
            response = self.client.post(self.note_url, {
                'title': 'Test Note',
                'description': 'This is a test note with audio.',
                'audio_file': audio,
            })
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'Test Note')
        self.assertEqual(response.data['description'], 'This is a test note with audio.')
        self.assertTrue('audio_file' in response.data)

    def tearDown(self):
        Note.objects.all().delete()
        User.objects.all().delete()
