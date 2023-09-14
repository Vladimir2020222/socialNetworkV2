from django.views.generic.edit import ModelFormMixin
from rest_framework.generics import ListCreateAPIView, GenericAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response

from feed.form import ImageForm
from feed.models import Post
from feed.serializers import PostSerializer


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
