from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import RetrieveModelMixin, CreateModelMixin, DestroyModelMixin, UpdateModelMixin
from rest_framework.response import Response

from accounts.utils import api_login_required
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


class BaseCommentAPIMixin(
    RetrieveModelMixin,
    CreateModelMixin,
    UpdateModelMixin,
    DestroyModelMixin
):
    def user_is_author(self):
        return self.get_object().author == self.request.author

    def get(self, request, pk):
        return self.retrieve(request)

    @method_decorator(api_login_required)
    def post(self, request):
        return self.create(request)

    @method_decorator(api_login_required)
    def delete(self, request, pk):
        if self.user_is_author():
            return self.destroy(request)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @method_decorator(api_login_required)
    def put(self, request, pk):
        if self.user_is_author():
            return self.update(request)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @method_decorator(api_login_required)
    def patch(self, request, pk):
        if self.user_is_author():
            return self.partial_update(request)
        return Response(status=status.HTTP_403_FORBIDDEN)


class CommentAPIView(
    BaseCommentAPIMixin,
    GenericAPIView
):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()


class ReplyAPIView(
    BaseCommentAPIMixin,
    GenericAPIView
):
    serializer_class = ReplySerializer
    queryset = Reply.objects.all()
