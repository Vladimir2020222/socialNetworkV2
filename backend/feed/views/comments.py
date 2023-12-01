from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from feed.models import Reply, Comment


class GetRepliesAmountAPIView(GenericAPIView):
    def get(self, request, pk):
        amount = Reply.objects.filter(to_id=pk).count()
        return Response(amount)


class GetCommentsAmountAPIView(GenericAPIView):
    def get(self, request, pk):
        amount = Comment.objects.filter(post_id=pk).count()
        return Response(amount)
