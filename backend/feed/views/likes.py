from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from feed.models import Post
from feed.services import remove_like_from_post, remove_dislike_from_post, like_post, dislike_post


class BaseRatePostAPIView(GenericAPIView):
    queryset = Post.objects.all()
    function = None

    def get(self, request, pk):
        assert self.function, 'base class must provide function to change user\' s rate'
        post = self.get_object()
        self.function(request.user, post)
        return Response


class LikePostAIPView(BaseRatePostAPIView):
    function = like_post


class RemoveLikeAPIView(BaseRatePostAPIView):
    function = remove_like_from_post


class DislikePostAPIView(BaseRatePostAPIView):
    function = dislike_post


class RemoveDislikeAPIView(BaseRatePostAPIView):
    function = remove_dislike_from_post
