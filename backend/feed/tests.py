import json
import random
from typing import Type, Union

import lorem
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from common.tests import send_login_request
from .models import Post, Comment, Reply

User = get_user_model()

ModelAPITestCaseMixinType = Union[TestCase, 'ModelAPITestCaseMixin']


def create_test_comments(posts, users):
    comments = []
    for i in range(round(
            len(posts) * random.randint(3, 5) / 1.7 + 2
    )):
        comments.append(Comment(
            author=random.choice(users) if i > 1 else users[0],  # create two posts by user1
            text=lorem.text(),
            post=random.choice(posts)
        ))
    return Comment.objects.bulk_create(comments)


class ModelAPITestCaseMixin:
    users: list[User] = []
    model: Type[Post] | Type[Comment] | Type[Reply]
    objects_attribute_name: str
    posts: list[Post]

    @classmethod
    def setUpTestData(cls):
        cls.users.clear()
        for i in range(1, 7):
            cls.users.append(
                User.objects.create_user(username=f'user{i}', password='12345')
            )

        cls.posts = Post.objects.bulk_create([
                Post(text=lorem.text(), author=random.choice(cls.users))
                for _ in range(random.randint(8, 17))
            ] + [
                Post(text=lorem.text(), author=cls.users[0]),
                Post(text=lorem.text(), author=cls.users[0])
        ])

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.model_name = cls.model._meta.model_name

    def get_random_object(self, *, author1=False) -> Post | Reply | Comment:
        objects = tuple(filter(
            lambda o: (not author1) or o.author == self.users[0],  # if author1 is True, only include objects by user1
            getattr(self, self.objects_attribute_name)
        ))
        return random.choice(objects)

    def get_object_creation_kwargs(self):
        return {'text': lorem.text(), 'author': random.choice(self.users).pk}

    def get_object_update_kwargs(self):
        return {'text': lorem.text() + ' new'}

    def send_rate_request(self: ModelAPITestCaseMixinType, object, action):
        self.client.post(
            reverse('rate', kwargs={'pk': object.pk, 'action': action, 'model_name': self.model_name}),
        )

    def test_object_liked_by(self: ModelAPITestCaseMixinType):
        object = self.get_random_object()
        users = self.users[0], self.users[2], self.users[4], self.users[1]
        object.liked_by.add(*users)
        response = self.client.get(
            reverse('object_liked_by', kwargs={'model_name': self.model_name}),
            {'pk': object.pk}
        )
        users_pks = json.loads(response.content)
        self.assertEqual(sorted(users_pks), sorted([u.pk for u in users]))

    def test_object_disliked_by(self: ModelAPITestCaseMixinType):
        object = self.get_random_object()
        users = self.users[0], self.users[2], self.users[4], self.users[1]
        object.disliked_by.add(*users)
        response = self.client.get(
            reverse('object_disliked_by', kwargs={'model_name': self.model_name}),
            {'pk': object.pk}
        )
        users_pks = json.loads(response.content)
        self.assertEqual(sorted(users_pks), sorted([u.pk for u in users]))

    def test_like_object(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        object = self.get_random_object()
        self.send_rate_request(object, 'like')
        self.assertTrue(object.liked_by.contains(self.users[0]))

    def test_dislike_object(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        object = self.get_random_object()
        self.send_rate_request(object, 'dislike')
        self.assertTrue(object.disliked_by.contains(self.users[0]))

    def test_remove_like_from_object(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        object = self.get_random_object()
        self.send_rate_request(object, 'like')
        self.send_rate_request(object, 'remove_like')
        self.assertFalse(object.liked_by.contains(self.users[0]))

    def test_remove_dislike_from_object(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        object = self.get_random_object()
        self.send_rate_request(object, 'dislike')
        self.send_rate_request(object, 'remove_dislike')
        self.assertFalse(object.disliked_by.contains(self.users[0]))

    def test_detail(self: ModelAPITestCaseMixinType):
        object = self.get_random_object()
        response = self.client.get(
            reverse(self.model_name, kwargs={'pk': object.pk})
        )
        response_object = json.loads(response.content)
        self.assertEqual(response_object['text'], object.text)

    def test_object_cant_be_deleted_by_not_author(self: ModelAPITestCaseMixinType):
        send_login_request(self.client, username='user2')
        object = self.get_random_object(author1=True)
        response = self.client.delete(
            reverse(self.model_name, kwargs={'pk': object.pk})
        )
        self.assertEqual(response.status_code, 403)

    def test_object_can_be_deleted_by_author(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        object = self.get_random_object(author1=True)
        self.client.delete(
            reverse(self.model_name, kwargs={'pk': object.pk})
        )
        self.assertNotIn(object.pk, self.model.objects.values_list('pk', flat=True))

    def test_object_cant_be_created_by_unauthorized_user(self: ModelAPITestCaseMixinType):
        response = self.client.post(
            reverse(self.model_name),
            self.get_object_creation_kwargs(),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)

    def test_object_cant_be_deleted_by_unauthorized_user(self: ModelAPITestCaseMixinType):
        object = self.get_random_object()
        response = self.client.delete(
            reverse(self.model_name, kwargs={'pk': object.pk}),
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn(object.pk, self.model.objects.values_list('pk', flat=True))

    def test_object_cant_be_updated_by_unauthorized_user(self: ModelAPITestCaseMixinType):
        object = self.get_random_object()
        response = self.client.patch(
            reverse('post', kwargs={'pk': object.pk}),
            kwargs := self.get_object_update_kwargs(),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)
        self.assertNotEqual(kwargs['text'], self.model.objects.get(pk=object.pk).text)

    def test_object_creation(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        response = self.client.post(
            reverse(self.model_name),
            kwargs := self.get_object_creation_kwargs(),
            content_type='application/json'
        )
        response_object = json.loads(response.content)
        self.assertEqual(response_object['text'], kwargs['text'])
        self.assertIn(response_object['pk'], self.model.objects.values_list('pk', flat=True))

    def test_object_update(self: ModelAPITestCaseMixinType):
        send_login_request(self.client)
        object = self.get_random_object(author1=True)
        send_login_request(self.client)
        self.client.patch(
            reverse(self.model_name, kwargs={'pk': object.pk}),
            kwargs := self.get_object_update_kwargs(),
            content_type='application/json'
        )
        self.assertEqual(self.model.objects.get(pk=object.pk).text, kwargs['text'])


class PostAPITestCase(ModelAPITestCaseMixin, TestCase):
    model = Post
    objects_attribute_name = 'posts'

    def add_post_to_viewed(self, pk):
        self.client.get(
            reverse('add_post_to_viewed', kwargs={'pk': pk})
        )

    def test_add_post_to_viewed(self):
        send_login_request(self.client)
        post = self.get_random_object()
        self.add_post_to_viewed(post.pk)
        self.assertIn(self.users[0].pk, post.viewed_by.values_list('pk', flat=True))

    def test_add_post_to_viewed_unauthorized(self):
        post = self.get_random_object()
        self.add_post_to_viewed(post.pk)
        self.assertEqual(str(post.pk), self.client.cookies['viewed_posts'].value)

    def test_get_additional_posts_does_not_contain_viewed_posts(self):
        send_login_request(self.client)
        self.test_get_additional_posts_does_not_contain_viewed_posts_unauthorized()

    def test_get_additional_posts_does_not_contain_viewed_posts_unauthorized(self):
        viewed_posts_pks = set(
            self.posts[random.randint(0, 9)].pk
            for _ in range(random.randint(1, 6))
        )
        for pk in viewed_posts_pks:
            self.add_post_to_viewed(pk)
        response = self.client.get(
            reverse('get_additional_posts_for_feed'),
            {'amount': len(self.posts)}
        )
        posts = json.loads(response.content)
        posts_pks = tuple(p['pk'] for p in posts)
        for pk in viewed_posts_pks:
            self.assertNotIn(pk, posts_pks)

    def get_all_posts_by_user_pks(self):
        user = self.users[4]
        for _ in range(13):
            Post.objects.create(text=lorem.text(), author=user)

        returned_posts_pks = []
        offset = 0
        for _ in range(Post.objects.filter(author=user).count() // 3 + 5):
            response = self.client.get(
                reverse('posts_by_user', kwargs={'pk': user.pk}),
                {'offset': offset, 'amount': 3}
            )
            offset += 3
            posts = json.loads(response.content)
            returned_posts_pks.extend([post['pk'] for post in posts])
        return returned_posts_pks

    def test_posts_by_user_does_not_return_duplicates(self):
        returned_posts_pks = self.get_all_posts_by_user_pks()
        self.assertEqual(len(returned_posts_pks), len(set(returned_posts_pks)))

    def test_posts_by_user_returns_all_posts(self):
        returned_posts_pks = self.get_all_posts_by_user_pks()
        self.assertEqual(
            set(returned_posts_pks), set(Post.objects.filter(author_id=self.users[4].pk).values_list('pk', flat=True))
        )


class CommentAPITestCase(ModelAPITestCaseMixin, TestCase):
    model = Comment
    objects_attribute_name = 'comments'

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.comments = create_test_comments(cls.posts, cls.users)

    def get_object_creation_kwargs(self):
        return super().get_object_creation_kwargs() | {'post': random.choice(self.posts).pk}

    def get_object_update_kwargs(self):
        return super().get_object_update_kwargs() | {'post': random.choice(self.posts).pk}

    def get_all_post_comments_pks(self):
        post = self.posts[4]
        for _ in range(13):
            Comment.objects.create(text=lorem.text(), author=random.choice(self.users), post=post)

        returned_comment_pks = []
        offset = 0
        for _ in range(Comment.objects.filter(post=post).count() // 3 + 5):
            response = self.client.get(
                reverse('post_comments', kwargs={'pk': post.pk}),
                {'offset': offset, 'amount': 3}
            )
            offset += 3
            posts = json.loads(response.content)
            returned_comment_pks.extend([post['pk'] for post in posts])
        return returned_comment_pks

    def test_post_comments_does_not_return_duplicates(self):
        returned_comment_pks = self.get_all_post_comments_pks()
        self.assertEqual(len(returned_comment_pks), len(set(returned_comment_pks)))

    def test_post_comments_returns_all_comments(self):
        returned_comment_pks = self.get_all_post_comments_pks()
        self.assertEqual(
            set(returned_comment_pks), set(Comment.objects.filter(post=self.posts[4]).values_list('pk', flat=True))
        )

    def test_post_comments_amount(self):
        post = random.choice(self.posts)
        response = self.client.get(
            reverse('get_comments_amount', kwargs={'pk': post.pk})
        )
        amount = json.loads(response.content)
        self.assertEqual(amount, Comment.objects.filter(post=post).count())


class ReplyAPITestCase(ModelAPITestCaseMixin, TestCase):
    model = Reply
    objects_attribute_name = 'replies'
    replies: list[Reply]
    comments: list[Comment]

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.comments = create_test_comments(cls.posts, cls.users)
        cls.replies = []
        for _ in range(round(
                len(cls.posts) * random.randint(3, 5) * 2.5
        )):
            if len(cls.replies) >= 2:
                reply_to = random.choices(cls.replies, k=random.randint(0, 2))
            else:
                reply_to = []
            cls.replies.append(reply := Reply.objects.create(
                author=random.choice(cls.users),
                to=random.choice(cls.comments),
                text=lorem.text()
            ))
            reply.reply_to.set(reply_to)

    def get_object_creation_kwargs(self):
        return super().get_object_creation_kwargs() | {'to': random.choice(self.comments).pk, 'reply_to': []}

    def get_object_update_kwargs(self):
        return super().get_object_update_kwargs() | {'to': random.choice(self.comments).pk, 'reply_to': []}

    def get_all_comment_replies_pks(self):
        comment = self.comments[4]
        for _ in range(13):
            Reply.objects.create(text=lorem.text(), author=random.choice(self.users), to=comment)

        returned_replies_pks = []
        offset = 0
        for _ in range(Reply.objects.filter(to=comment).count() // 3 + 5):
            response = self.client.get(
                reverse('comment_replies', kwargs={'pk': comment.pk}),
                {'offset': offset, 'amount': 3}
            )
            offset += 3
            posts = json.loads(response.content)
            returned_replies_pks.extend([post['pk'] for post in posts])
        return returned_replies_pks

    def test_post_comments_does_not_return_duplicates(self):
        returned_replies_pks = self.get_all_comment_replies_pks()
        self.assertEqual(len(returned_replies_pks), len(set(returned_replies_pks)))

    def test_post_comments_returns_all_comments(self):
        returned_replies_pks = self.get_all_comment_replies_pks()
        self.assertEqual(
            set(returned_replies_pks), set(Reply.objects.filter(to=self.comments[4]).values_list('pk', flat=True))
        )

    def test_comment_replies_amount(self):
        comment = random.choice(self.comments)
        response = self.client.get(
            reverse('get_replies_amount', kwargs={'pk': comment.pk})
        )
        amount = json.loads(response.content)
        self.assertEqual(amount, Reply.objects.filter(to=comment).count())
