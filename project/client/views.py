from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

def index(request):
    return render(request,"index.html")

def home(request):
    return HttpResponse("homePage")
