from django.urls import path

from .views import *


urlpatterns = [
    path('add_post_to_viewed/<int:pk>', AddPostToViewedAPIView.as_view(), name='add_post_to_viewed'),
    path('get_additional_posts', GetAdditionalPostsForFeedAPIView.as_view(), name='get_additional_posts_for_feed'),
    path('add_images_to_post/<int:pk>', AddImagesToPostAPIView.as_view(), name='add_image_to_post'),
    path('users_liked_post_list', PostLikedByAPIView.as_view(), name='post_liked_by'),
    path('users_disliked_post_list', PostDislikedByAPIView.as_view(), name='post_disliked_by'),
    path('post/<int:pk>', PostAPIView.as_view(), name='post'),
    path('post', PostAPIView.as_view(), name='post'),
    path('posts/by/<int:pk>', PostsByUserScrollableAPIView.as_view(), name='posts_by_user'),
    path('comment_replies/<int:pk>', CommentRepliesScrollableAPIView.as_view(), name='comment_replies'),
    path('post/<int:pk>/comments', PostCommentsScrollableAPIView.as_view(), name='post_comments'),
    path('comment_replies/<int:pk>/amount', GetCommentsAmountAPIView.as_view(), name='get_comments_amount'),

    path('like/<int:pk>', LikePostAIPView.as_view(), name='like_post'),
    path('remove_like/<int:pk>', RemoveLikeAPIView.as_view(), name='remove_like_from_post'),
    path('dislike/<int:pk>', DislikePostAPIView.as_view(), name='dislike_post'),
    path('remove_dislike/<int:pk>', RemoveDislikeAPIView.as_view(), name='remove_dislike_from_post')
]
