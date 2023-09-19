from django.http import HttpResponse


class HeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":  # Google Chrome sends OPTIONS reqeust before POST
            response = HttpResponse('')
        else:
            response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "http://localhost:4200"
        response["Access-Control-Allow-Methods"] = "*"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        response["Access-Control-Allow-Credentials"] = 'true'
        return response
