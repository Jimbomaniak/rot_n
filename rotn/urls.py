from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.main, name='main'),
    url(r'^enter/$', views.result_cipher, name='result'),
    ]


