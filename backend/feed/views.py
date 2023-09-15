from django.contrib.auth import get_user_model
from django.views.generic.edit import ModelFormMixin
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from feed.form import ImageForm
from feed.models import Post
from feed.serializers import PostSerializer


User = get_user_model()


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


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @action(methods=['get'], detail=True)
    def user(self, request, pk):
        pk = self.kwargs['pk']
        author = User.objects.get(pk=pk)
        posts = Post.objects.filter(author=author)
        serializer = self.get_serializer(instance=posts, many=True)
        return Response(serializer.data)
