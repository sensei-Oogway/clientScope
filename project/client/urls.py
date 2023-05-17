from django.urls import path, include
from . import views

urlpatterns = [path("",views.index),path("home",views.home), path("login",views.commonLogin), path("register",views.registerUser)]