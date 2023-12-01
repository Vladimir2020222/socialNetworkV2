from rest_framework.generics import GenericAPIView
from rest_framework.mixins import RetrieveModelMixin, CreateModelMixin, DestroyModelMixin, UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

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


class HttpMethodsClassMethodsMatchMixin:
    def get(self, request, pk):
        return self.retrieve(request)

    def post(self, request):
        return self.create(request)

    def delete(self, request, pk):
        return self.destroy(request)

    def put(self, request, pk):
        return self.update(request)

    def patch(self, request, pk):
        return self.partial_update(request)


class CommentAPIView(
    HttpMethodsClassMethodsMatchMixin,
    GenericAPIView,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
    UpdateModelMixin
):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


class ReplyAPIView(
    HttpMethodsClassMethodsMatchMixin,
    GenericAPIView,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
    UpdateModelMixin
):
    serializer_class = ReplySerializer
    queryset = Reply.objects.all()
