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
        request.session['userID'] = email

        return HttpResponse("client")
    else:
        prof = Professional.authenticate(email,password)
        if(prof):
            #Render professional homepage
            request.session['userType'] = 'professional'
            request.session['userID'] = email

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
    if(request.session.get('userType') == "client"):
        return render(request,"homepage_base_client.html")
    
    index(request)

def submitRequest(request):
    id = request.session.get('userID')
    print(id)
    client = Client.get_client_by_id(id)
    if(client is None):
        return index(request)
    else:
        location = request.POST.get('location')
        serviceType = request.POST.get('serviceType')

        amount = float(request.POST.get('amount'))
        details = request.POST.get('details')

        rating = 0

        # req = Request.create_request(client,location,amount,rating,details,serviceType)
        # if(req):
        #     pros = Professional.get_professionals_by_service(serviceType)
        #     Offer.publish_offers(request,pros)
        #     return HttpResponse("success")

        return HttpResponse("success")

def fetchOngoing(request):
    #Fetch all the open requests
        #Fetch all unaccepted requests
        #Fetch all offers
    #Fetch all ongoing requests

    #Create a separate template and append these modules to the overall div
        #1. unaccepted
        #2. offers
        #3. ongoing

    #Finally render the overall div

    return HttpResponse("suc")