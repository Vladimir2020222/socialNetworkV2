from django.contrib.auth import get_user_model
from django.db.models import Subquery
from django.views.generic.edit import ModelFormMixin
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.views.mixins import GetUserMixin
from feed.form import ImageForm
from feed.models import Post
from feed.serializers import PostSerializer


User = get_user_model()


class AddImageToPostAPIView(GenericAPIView, ModelFormMixin):
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


class AddPostToViewedAPIView(GetUserMixin, GenericAPIView):
    def get(self, request):
        user = self.get_object()
        pk = request.GET.get('post_pk')
        if user:
            post = Post.objects.get(pk=pk)
            post.viewed_by.add(user)
            return Response()
        else:
            response = Response()
            viewed_posts = request.COOKIES.get('viewed_posts')
            if viewed_posts is None:
                viewed_posts = str(pk)
            else:
                viewed_posts = viewed_posts + f',{pk}'
            response.set_cookie('viewed_posts', viewed_posts)
            return response


class GetAdditionalPostsForFeedAPIView(GetUserMixin, GenericAPIView):
    serializer_class = PostSerializer
    default_amount = 5

    def get(self, request):
        amount = int(request.GET.get('amount')) or self.default_amount
        user = self.get_object()
        if user:
            viewed = Subquery(user.viewed_posts.values_list('pk', flat=True))
        else:
            viewed = request.COOKIES.get('viewed_posts').split(',')
        not_viewed = Post.objects.exclude(pk__in=viewed)
        posts = not_viewed.order_by('?')[:amount]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
