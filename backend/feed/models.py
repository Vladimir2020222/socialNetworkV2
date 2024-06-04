import datetime
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class PublishedUpdatedDateMixin(models.Model):
    pub_date = models.DateTimeField(auto_now_add=True)
    upd_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class LikeableMixin(models.Model):
    liked_by = models.ManyToManyField(
        User,
        related_name='liked_%(app_label)s_%(class)ss',
        related_query_name='liked_%(app_label)s_%(class)s'
    )

    disliked_by = models.ManyToManyField(
        User,
        related_name='disliked_%(app_label)s_%(class)ss',
        related_query_name='disliked_%(app_label)s_%(class)s'
    )

    class Meta:
        abstract = True


class PostQuerySet(models.QuerySet):
    pass


class Post(LikeableMixin, PublishedUpdatedDateMixin):
    objects = PostQuerySet.as_manager()

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    viewed_by = models.ManyToManyField(User, related_name='viewed_posts', related_query_name='related_post')
    text = models.TextField(max_length=25000)


class CommentBaseQuerySet(models.QuerySet):
    pass


class CommentBase(LikeableMixin, PublishedUpdatedDateMixin):
    objects = CommentBaseQuerySet.as_manager()

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(max_length=5000)

    class Meta:
        abstract = True


class CommentQuerySet(CommentBaseQuerySet):
    pass


class Comment(CommentBase):
    objects = CommentQuerySet.as_manager()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)


class ReplyQuerySet(CommentBaseQuerySet):
    pass


class Reply(CommentBase):
    objects = ReplyQuerySet.as_manager()

    to = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='replies',
        related_query_name='reply'
    )
    reply_to = models.ManyToManyField(
        'Reply',
        related_name='replies',
        related_query_name='reply'
    )


def image_upload_to(instance, filename):
    upload_to = f'posts/images/%Y/%m/%d/{instance.post.pk}/{filename}'
    return datetime.datetime.now().strftime(upload_to)


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    content = models.ImageField(upload_to=image_upload_to)


class Notification(models.Model):
    class TypeChoices(models.TextChoices):
        new_post = "newPost"
        new_subscriber = "newSubscriber"
        post_commented = "postCommented"
        comment_replied = "commentReplied"
        reply_replied = "replyReplied"

    users = models.ManyToManyField(User)
    text = models.CharField(max_length=255)
    type = models.CharField(choices=TypeChoices.choices)
    object_pk = models.IntegerField()
    time = models.DateTimeField(auto_now_add=True)
