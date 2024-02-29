from django.urls import path

from .views import *

urlpatterns = [
    path('post/<int:pk>', PostAPIView.as_view(), name='post'),
    path('post', PostAPIView.as_view(), name='post'),
    path('reply/<int:pk>', ReplyAPIView.as_view(), name='reply'),
    path('reply', ReplyAPIView.as_view(), name='reply'),
    path('comment/<int:pk>', CommentAPIView.as_view(), name='comment'),
    path('comment', CommentAPIView.as_view(), name='comment'),
    path('add_post_to_viewed/<int:pk>', AddPostToViewedAPIView.as_view(), name='add_post_to_viewed'),
    path('get_additional_posts', GetAdditionalPostsForFeedAPIView.as_view(), name='get_additional_posts_for_feed'),
    path('add_images_to_post/<int:pk>', AddImagesToPostAPIView.as_view(), name='add_image_to_post'),
    path('users_liked_<str:model_name>_list', LikedByAPIView.as_view(), name='post_liked_by'),
    path('users_disliked_<str:model_name>_list', DislikedByAPIView.as_view(), name='post_disliked_by'),
    path('posts/by/<int:pk>', PostsByUserScrollableAPIView.as_view(), name='posts_by_user'),
    path('comment_replies/<int:pk>', CommentRepliesScrollableAPIView.as_view(), name='comment_replies'),
    path('post/<int:pk>/comments', PostCommentsScrollableAPIView.as_view(), name='post_comments'),
    path('comment_replies/<int:pk>/amount', GetRepliesAmountAPIView.as_view(), name='get_comments_amount'),
    path('post/<int:pk>/comments/amount', GetCommentsAmountAPIView.as_view(), name='get_comments_amount'),

    path('<str:action>/<str:model_name>/<int:pk>', RateAPIView.as_view(), name='rate')
]
