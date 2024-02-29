from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from rest_framework.views import APIView

from feed.mixins import BaseAuthorOwnedModelAPIView
from feed.models import Reply, Comment
from feed.serializers import CommentSerializer, ReplySerializer


class GetRepliesAmountAPIView(APIView):
    def get(self, request, pk):
        amount = Reply.objects.filter(to_id=pk).count()
        return Response(amount)


class GetCommentsAmountAPIView(APIView):
    def get(self, request, pk):
        amount = Comment.objects.filter(post_id=pk).count()
        return Response(amount)


@method_decorator(cache_page(120), name='dispatch')  # cache_page caches response only if request.method in (GET, HEAD)
class CommentAPIView(
    BaseAuthorOwnedModelAPIView
):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


@method_decorator(cache_page(120), name='dispatch')  # cache_page caches response only if request.method in (GET, HEAD)
class ReplyAPIView(
    BaseAuthorOwnedModelAPIView
):
    serializer_class = ReplySerializer
    queryset = Reply.objects.all()
