from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from feed.models import Post
from feed.services import remove_like_from_post, remove_dislike_from_post, like_post, dislike_post


class BaseRatePostAPIView(GenericAPIView):
    queryset = Post.objects.all()

    @staticmethod
    def function(user, post):
        raise NotImplemented('base class must provide function to change user\'s rate')

    def post(self, request, pk):
        post = self.get_object()
        self.function(request.user, post)
        return Response


class LikePostAIPView(BaseRatePostAPIView):
    @staticmethod
    def function(user, post):
        like_post(user, post)


class RemoveLikeAPIView(BaseRatePostAPIView):
    @staticmethod
    def function(user, post):
        remove_like_from_post(user, post)


class DislikePostAPIView(BaseRatePostAPIView):
    @staticmethod
    def function(user, post):
        dislike_post(user, post)


class RemoveDislikeAPIView(BaseRatePostAPIView):
    @staticmethod
    def function(user, post):
        remove_dislike_from_post(user, post)
