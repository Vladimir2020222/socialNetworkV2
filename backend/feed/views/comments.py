from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from feed.mixins import BaseAuthorMixin
from feed.models import Reply, Comment
from feed.serializers import CommentSerializer, ReplySerializer


class GetRepliesAmountAPIView(GenericAPIView):
    def get(self, request, pk):
        amount = Reply.objects.filter(to_id=pk).count()
        return Response(amount)


class GetCommentsAmountAPIView(GenericAPIView):
    def get(self, request, pk):
        amount = Comment.objects.filter(post_id=pk).count()
        return Response(amount)


@method_decorator(cache_page(120), name='dispatch')  # cache_page caches response only if request.method in (GET, HEAD)
class CommentAPIView(
    BaseAuthorMixin,
    GenericAPIView
):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


@method_decorator(cache_page(120), name='dispatch')  # cache_page caches response only if request.method in (GET, HEAD)
class ReplyAPIView(
    BaseAuthorMixin,
    GenericAPIView
):
    serializer_class = ReplySerializer
    queryset = Reply.objects.all()
