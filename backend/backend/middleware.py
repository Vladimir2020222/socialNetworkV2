import zoneinfo

from django.conf import settings
from django.utils import timezone


class AccessControlHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "http://localhost:4200"
        response["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Allow-Credentials"] = 'true'
        return response


class TimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tzname = request.session.get(settings.TIMEZONE_SESSION_KEY) or getattr(request.user, 'timezone_name', None)
        if tzname:
            timezone.activate(zoneinfo.ZoneInfo(tzname))
        else:
            timezone.deactivate()
        return self.get_response(request)
