from rest_framework.generics import ListCreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from feed.models import Post
from feed.serializers import PostSerializer, PostEditSerializer


class ListCreatePostView(ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects


class PostView(APIView):
    def get(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(instance=post)
        return Response(serializer.data)


class PostEditView(UpdateAPIView):
    serializer_class = PostEditSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        return Post.objects.get(pk=pk)
