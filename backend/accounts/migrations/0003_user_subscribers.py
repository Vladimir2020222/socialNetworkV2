# Generated by Django 4.2.5 on 2023-09-23 07:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_user_ava'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='subscribers',
            field=models.ManyToManyField(related_name='subscriptions', related_query_name='subscription', to=settings.AUTH_USER_MODEL),
        ),
    ]
