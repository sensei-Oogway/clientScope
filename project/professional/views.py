from django.shortcuts import render
from client.views import index
from django.http import HttpRequest, HttpResponse
from client.models import Client, Request, Offer
from professional.models import Professional
from django.http import JsonResponse


# Create your views here.
def home(request):
    if(request.session.get('userType') == "professional"):
        return render(request,"homepage_base_pro.html")
    
    index(request)