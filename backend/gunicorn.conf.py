import os

wsgi_app = 'backend.wsgi:application'
bind = 'localhost:' + os.getenv('DJANGO_PORT', '8000')
workers = int(os.getenv('GUNICORN_WORKERS', 6))

