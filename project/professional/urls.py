from django.urls import path, include
from . import views

urlpatterns = [
               path("home",views.home),
               path("jobs",views.fetchJobs),
               path("accept",views.acceptJob),
               path("reject",views.rejectJob),
               path("ongoing",views.fetchOngoingJobs)
                ]