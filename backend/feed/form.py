from django import forms

from feed.models import Image


class ImageForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = '__all__'
