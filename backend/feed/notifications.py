from feed.models import Notification


def send_post_created_notifications(post):
    author = post.author
    notification = Notification.objects.create(
        text=f'user {author.get_full_name()} created new post',
        type=Notification.TypeChoices.new_post,
        object_pk=post.pk
    )
    subscribers = author.subscribers.all()
    notification.users.add(subscribers)


def send_new_subscriber_notification(user, subscriber):
    notification = Notification.objects.create(
        text=f'you got a new subscriber: {subscriber.get_full_name()}',
        type=Notification.TypeChoices.new_subscriber,
        object_pk=subscriber.pk
    )
    notification.users.add(user)


def send_post_commented_notification(comment):
    text = comment.text if len(comment.text) < 35 else comment.text[:30] + '...'
    notification = Notification.objects.create(
        text=f'your post was commented by {comment.author.get_full_name()}: {text}',
        type=Notification.TypeChoices.post_commented,
        object_pk=comment.pk
    )
    notification.users.add(comment.post.author)


def send_comment_replied_notification(reply):
    text = reply.text if len(reply.text) < 35 else reply.text[:30] + '...'
    notification = Notification.objects.create(
        text=f'{reply.author.get_full_name()} replied to your comment: {text}',
        type=Notification.TypeChoices.comment_replied,
        object_pk=reply.pk
    )
    notification.users.add(reply.to.author)


def send_reply_replied_notification(reply):
    text = reply.text if len(reply.text) < 35 else reply.text[:30] + '...'
    notification = Notification.objects.create(
        text=f'{reply.author.get_full_name()} replied to your reply: {text}',
        type=Notification.TypeChoices.reply_replied,
        object_pk=reply.pk
    )
    notification.users.add(*reply.reply_to.values_list('author_id', flat=True))
