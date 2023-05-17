from django.shortcuts import render
from django.http import HttpRequest, HttpResponse

def index(request):
    return render(request,"index.html")

def commonLogin(request):
    emailId = request.POST.get('email')
    passWord = request.POST.get('password')

    print(emailId, passWord)

    return HttpResponse("login successful")

def home(request):
    return HttpResponse("homePage")
