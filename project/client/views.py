from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from client.models import Client, Request, Offer
from professional.models import Professional

def index(request):
    return render(request,"index.html")

def commonLogin(request):
    email = request.POST.get('email')
    password = request.POST.get('password')

    #Check if its client
    client = Client.authenticate(email,password)
    if(client):
        #Render client homepage
        request.session['userType'] = 'client'
        request.session['userID'] = 'emailId'

        return HttpResponse("login successful")
    else:
        prof = Professional.authenticate(email,password)
        if(prof):
            #Render professional homepage
            request.session['userType'] = 'professional'
            request.session['userID'] = 'emailId'

            return HttpResponse("login successful")
    
    return HttpResponse("login Failure")

    

def registerUser(request):
    print(request.POST.items())

    name = request.POST.get('first_name') + request.POST.get('last_name')
    email = request.POST.get('emailId')
    password = request.POST.get('password')
    phone = request.POST.get('phone')

    account = request.POST.get('card_number') + "$" + request.POST.get('cvv') + "$" + request.POST.get('exp_date')

    userType = request.POST.get('userType')

    if(userType == 'client'):
        subscriptionType = request.POST.get('subscriptionType')
        client = Client.create(name,subscriptionType,email,password,phone,account)
        if(client):
            return render(request,"index.html")

    elif(userType == 'professional'):
        services = request.POST.get('services')
        service_ = ""
        for service in services:
            service_ += service + "$"

        service_ = service_.rstrip("$")

        prof = Professional.create(email,name,password,phone,account,service_)
        if(prof):
            return render(request,"index.html")


    return HttpResponse("Registration Failed")

def home(request):
    return HttpResponse("homePage")
