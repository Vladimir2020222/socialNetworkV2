from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.images import ImageFile
from django.db.models import Subquery
from django.http import HttpResponse
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin, UpdateModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from accounts.views.mixins import GetUserMixin
from feed.models import Post, Image, Reply, Comment
from feed.serializers import PostSerializer


User = get_user_model()


class AddImagesToPostAPIView(GenericAPIView):
    queryset = Post.objects.all()

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        if not request.user == post.author:
            return Response('You can not add images to this post because you are not its author')
        files = request.FILES.getlist('images')
        images = Image.objects.bulk_create(
            [Image(post=post, content=ImageFile(file)) for file in files]
        )
        return Response({'images': [image.content.url for image in images]})


class AddPostToViewedAPIView(GetUserMixin, GenericAPIView):
    def get(self, request, pk):
        user = self.get_object()
        file = open((settings.MEDIA_URL + '1x1.png')[1:], mode='rb')
        response = HttpResponse(file.read(), content_type='image/jpeg')
        file.close()
        if user:
            post = Post.objects.get(pk=pk)
            post.viewed_by.add(user)
            return response
        else:
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
        amount = int(request.GET.get('amount') or self.default_amount)
        user = self.get_object()
        if user.is_authenticated:
            viewed = Subquery(user.viewed_posts.values_list('pk', flat=True))
        else:
            viewed = request.COOKIES.get('viewed_posts')
            viewed = map(int, viewed.split(',')) if viewed else []
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


class PostLikedByAPIView(GenericAPIView):
    def get(self, request):
        pk = request.GET.get('pk')
        post = Post.objects.get(pk=pk)
        liked_by = post.liked_by.values_list('pk', flat=True)
        return Response(liked_by)


class PostDislikedByAPIView(GenericAPIView):
    def get(self, request):
        pk = request.GET.get('pk')
        post = Post.objects.get(pk=pk)
        disliked_by = post.dsiliked_by.values_list('pk', flat=True)
        return Response(disliked_by)


class GetCommentsAmountAPIView(GenericAPIView):
    def get(self, request, pk):
        amount = Reply.objects.filter(to_id=pk).count()
        return Response(amount)
