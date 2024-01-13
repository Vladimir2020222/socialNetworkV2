from django.middleware.cache import CacheMiddleware


class ConditionalCacheMiddleware(CacheMiddleware):
    view = view_args = view_kwargs = None

    def __init__(self, get_response, should_update_func, cache_timeout=None, page_timeout=None, **kwargs):
        super().__init__(get_response, cache_timeout, page_timeout, **kwargs)
        self.should_update_func = should_update_func

    def _should_update_cache(self, request, response):
        if self.should_update_func(self.view, request, response, *self.view_args, **self.view_kwargs):
            return super()._should_update_cache(request, response)
        return False

    def process_view(self, request, view_func, view_args, view_kwargs):
        self.view = view_func
        self.view_args = view_args
        self.view_kwargs = view_kwargs
