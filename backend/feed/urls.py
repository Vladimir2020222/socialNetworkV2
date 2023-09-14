from django.urls import path
from django.views.decorators.http import require_POST, require_GET

from .views import ListCreatePostView, PostView, AddImageToPostView


urlpatterns = [
    path('addPost', require_POST(ListCreatePostView.as_view())),
    path('posts', require_GET(ListCreatePostView.as_view())),
    path('post/<int:pk>', PostView.as_view()),
    path('add_image_to_post/<int:pk>', AddImageToPostView.as_view())
]
