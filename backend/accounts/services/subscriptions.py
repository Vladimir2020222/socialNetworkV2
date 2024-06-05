from django.contrib.auth import get_user_model

from feed.notifications import send_new_subscriber_notification

User = get_user_model()


def subscribe(user, to: int):
    to = User.objects.get(pk=to)
    user.subscribe(to)
    send_new_subscriber_notification(to, user)


def unsubscribe(user, from_: int):
    from_ = User.objects.get(pk=from_)
    user.unsubscribe(from_)


def is_subscribed_to(user, to: int):
    to = User.objects.get(pk=to)
    return user.is_subscribed_to(to)
