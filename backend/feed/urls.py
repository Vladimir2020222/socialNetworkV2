from django.urls import path

from .views import AddImagesToPostAPIView, AddPostToViewedAPIView, GetAdditionalPostsForFeedAPIView, PostAPIView


urlpatterns = [
    path('add_post_to_viewed', AddPostToViewedAPIView.as_view(), name='add_post_to_viewed'),
    path('get_additional_posts', GetAdditionalPostsForFeedAPIView.as_view(), name='get_additional_posts_for_feed'),
    path('add_images_to_post/<int:pk>', AddImagesToPostAPIView.as_view(), name='add_image_to_post'),
    path('post/<int:pk>', PostAPIView.as_view(), name='post'),
    path('post', PostAPIView.as_view(), name='post')
]
