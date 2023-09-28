from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import PostViewSet, AddImageToPostAPIView


post_router = SimpleRouter()
post_router.register('post', PostViewSet)


urlpatterns = [
    path('', include(post_router.urls)),
    path('add_image_to_post/<int:pk>', AddImageToPostAPIView.as_view())
]
