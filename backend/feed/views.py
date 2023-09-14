from django.views.generic.edit import ModelFormMixin
from rest_framework.generics import ListCreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from feed.form import ImageForm
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


class AddImageToPostView(ModelFormMixin, APIView):
    form_class = ImageForm

    def post(self, request):
        form = self.get_form()
        if form.is_valid():
            self.form_valid(form)
            return Response({'success': True})
        else:
            self.form_invalid(form)
            return Response({'success': False})
