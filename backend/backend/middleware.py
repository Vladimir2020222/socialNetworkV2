import zoneinfo
from time import time

from django.conf import settings
from django.core.exceptions import MiddlewareNotUsed
from django.utils import timezone

from database_queries_logger import queries_logger


class AccessControlHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if http_referer := request.META.get('HTTP_REFERER'):
            response["Access-Control-Allow-Origin"] = http_referer[:-1]
        response["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Allow-Credentials"] = 'true'
        return response


class TimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tzname = request.session.get(settings.TIMEZONE_SESSION_KEY) or getattr(request.user, 'timezone_name', None)
        self.update_user_tzname(request, tzname)
        if tzname:
            timezone.activate(zoneinfo.ZoneInfo(tzname))
        else:
            timezone.deactivate()
        return self.get_response(request)

    def update_user_tzname(self, request, tzname):
        user = request.user
        if tzname is None or user.is_anonymous or user.timezone_name == tzname:
            return
        user.timezone_name = tzname
        user.save()


class DebugMiddleware:
    def __init__(self, get_response):
        if not settings.DEBUG or settings.DISABLE_DEBUG_MIDDLEWARE:
            raise MiddlewareNotUsed()
        self.get_response = get_response

    def __call__(self, request):
        start = time()
        response = self.get_response(request)
        end = time()
        time_spent = end - start

        print(queries_logger)
        print(f'{len(queries_logger)} queries; spent {time_spent} seconds;')
        queries_logger.clear()
        return response
