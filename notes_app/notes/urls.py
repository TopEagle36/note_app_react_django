from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet)  # Registering the NoteViewSet to handle the 'notes' endpoint

urlpatterns = [
    path('', include(router.urls)),  # Make sure to include the router URLs
]
