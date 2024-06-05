from django.contrib.auth import get_user_model
from django.core.files.images import ImageFile
from django.db.models import Subquery
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.utils import api_login_required
from feed.mixins import BaseAuthorOwnedModelAPIView
from feed.models import Post, Image, Notification
from feed.notifications import send_post_created_notifications
from feed.serializers import PostSerializer


User = get_user_model()


class ChangePostImagesAPIView(APIView):
    @method_decorator(api_login_required)
    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        if not request.user == post.author:
            return Response('', status=status.HTTP_403_FORBIDDEN)
        files = request.FILES.getlist('images')
        images = Image.objects.bulk_create(
            [Image(post=post, content=ImageFile(file)) for file in files]
        )
        return Response([{'pk': image.pk, 'url': image.content.url} for image in images])

    @method_decorator(api_login_required)
    def delete(self, request, post_pk):
        post = Post.objects.get(pk=post_pk)
        if not request.user == post.author:
            return Response('', status=status.HTTP_403_FORBIDDEN)
        files_pks = map(int, request.GET.get('files_pks').split(','))
        post.images.filter(pk__in=files_pks).delete()
        return Response('', status=status.HTTP_204_NO_CONTENT)


class AddPostToViewedAPIView(APIView):
    def get(self, request, pk):
        user = request.user
        file = open('1x1.png', mode='rb')
        response = HttpResponse(file.read(), content_type='image/jpeg')
        file.close()
        if user.is_authenticated:
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


class GetAdditionalPostsForFeedAPIView(GenericAPIView):
    serializer_class = PostSerializer
    default_amount = 5

    def get(self, request):
        amount = int(request.GET.get('amount') or self.default_amount)
        user = request.user
        if user.is_authenticated:
            viewed = Subquery(user.viewed_posts.values_list('pk', flat=True))
        else:
            viewed = request.COOKIES.get('viewed_posts')
            viewed = map(int, viewed.split(',')) if viewed else []
        not_viewed = Post.objects.exclude(pk__in=viewed)
        posts = not_viewed.order_by('?')[:amount]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


@method_decorator(cache_page(120), name='dispatch')  # cache_page caches response only if request.method in (GET, HEAD)
class PostAPIView(
    BaseAuthorOwnedModelAPIView
):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def send_object_created_notification(self, instance):
        send_post_created_notifications(instance)
