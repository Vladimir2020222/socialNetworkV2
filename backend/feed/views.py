from django.contrib.auth import get_user_model
from django.views.generic.edit import ModelFormMixin
from rest_framework.generics import ListCreateAPIView, GenericAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.response import Response

from feed.form import ImageForm
from feed.models import Post
from feed.serializers import PostSerializer


User = get_user_model()


class ListCreatePostView(ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects


class PostView(RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()


class AddImageToPostView(GenericAPIView, ModelFormMixin):
    form_class = ImageForm
    queryset = Post.objects.all()

    def post(self, request):
        form = self.get_form()
        if form.is_valid():
            self.form_valid(form)
            return Response({'success': True})
        else:
            self.form_invalid(form)
            return Response({'success': False})

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        if 'data' in kwargs:
            kwargs['data']['post'] = self.get_object().pk
        return kwargs


class UserPostsView(ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        author = User.objects.get(pk=pk)
        return Post.objects.filter(author=author)
