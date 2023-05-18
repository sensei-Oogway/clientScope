from django.urls import path, include
from . import views

urlpatterns = [path("",views.index),
               path("home",views.home),
                 path("login",views.commonLogin),
                   path("register",views.registerUser),
                     path("home/submitForm", views.submitRequest),
                     path("ongoing", views.fetchOngoing)]