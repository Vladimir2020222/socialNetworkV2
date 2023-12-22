from django.core.cache import cache

from common.decorators import get_key_for_per_user_cache
from .jwt import get_user_by_jwt, get_user_and_email_by_jwt, generate_new_jwt, generate_new_jwt_for_email_changing
from .subscriptions import is_subscribed_to, subscribe, unsubscribe


def remove_profile_cache(request):
    from ..views import ProfileAPIView
    key = get_key_for_per_user_cache(request, ProfileAPIView.get)
    cache.delete(key)
