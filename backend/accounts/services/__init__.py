from django.core.cache import cache

from common.decorators import get_key_for_per_user_cache
from .jwt import get_user_by_jwt, get_user_and_email_by_jwt, generate_new_jwt_auth, generate_new_jwt_for_email_changing
from .subscriptions import is_subscribed_to, subscribe, unsubscribe


def remove_profile_cache(request):
    from ..views import ProfileAPIView
    key = get_key_for_per_user_cache(request, ProfileAPIView.get)
    cache.delete(key)


def set_profile_cache(request, response, view):
    if response.streaming or response.status_code not in (200, 304):
        return
    from ..views import ProfileAPIView
    view.finalize_response(request, response)
    response.render()
    key = get_key_for_per_user_cache(request, ProfileAPIView.get)
    cache.set(key, response)
