from functools import wraps

from django.core.cache import caches, cache as default_cache


def per_user_cache_page(timeout, *, cache=None, key_prefix=''):
    def decorator(view):
        @wraps(view)
        def wrapper(request, *args, **kwargs):
            if cache:
                cache_ = caches[cache]
            else:
                cache_ = default_cache
            user_prefix = request.user.id if request.user.is_authenticated else 'anonymous'
            prefix = f'{key_prefix}__{user_prefix}__'
            path_to_view = view.__module__ + '.' + view.__qualname__
            key = f'{path_to_view}.{prefix}'

            cached_response = cache_.get(key, None)
            if cached_response:
                return cached_response
            response = view(request, *args, **kwargs)
            if response.streaming or response.status_code not in (200, 304):
                return response
            if hasattr(response, 'render') and callable(response.render):
                response.add_post_render_callback(
                    lambda r: cache_.set(key, r, timeout)
                )
            else:
                cache_.set(key, response, timeout)
            return response
        return wrapper
    return decorator
