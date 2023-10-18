from django.contrib.auth import get_user_model
from django.db.models import Subquery
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin, UpdateModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from accounts.views.mixins import GetUserMixin
from feed.models import Post, Image
from feed.serializers import PostSerializer


User = get_user_model()


class AddImagesToPostAPIView(GenericAPIView):
    queryset = Post.objects.all()

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        if not request.user == post.author:
            return Response('You can not add images to this post because you are not ist author')
        for file in request.FILES:
            Image.objects.create(post=post, content=file)
        return Response()


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


class PostAPIView(CreateModelMixin,
                  DestroyModelMixin,
                  UpdateModelMixin,
                  RetrieveModelMixin,
                  GenericAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, request, pk):
        return self.retrieve(request)

    def post(self, request):
        return self.create(request)

    def delete(self, request, pk):
        user = request.user
        self.post_ = self.get_object()
        if self.post_.author == user:
            self.destroy(request)
        else:
            return Response('You can not delete this post because you are not its author')

    def patch(self, request, pk):
        user = request.user
        self.post_ = self.get_object()
        if self.post_.authour == user:
            self.partial_update(request)
        else:
            return Response('You can not edit this post because you are not its author')

    def get_object(self):
        if hasattr(self, 'post_'):
            return self.post_
        return Post.objects.get(pk=self.kwargs.get('pk'))