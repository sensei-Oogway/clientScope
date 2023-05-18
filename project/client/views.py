from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
from client.models import Client, Request, Offer
from professional.models import Professional
from django.http import JsonResponse

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

            return HttpResponse("professional")
    
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
        services = request.POST.getlist('services')
        print(services)
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
    #print(id)
    client = Client.get_client_by_id(id)
    if(client is None):
        return index(request)
    else:
        location = request.POST.get('location')
        serviceType = request.POST.get('serviceType')

        amount = float(request.POST.get('amount'))
        details = request.POST.get('details')

        rating = 0

        req = Request.create_request(client,location,amount,rating,details,serviceType)
        if(req):
            pros = Professional.get_professionals_by_service(serviceType)
            offrs = Offer.publish_offers(req,pros)
            return HttpResponse("success")

        return HttpResponse("error")

def fetchOngoing(request):
    id = request.session.get('userID')
    client = Client.get_client_by_id(id)
    if(client is None):
        return index(request)
    
    #Fetch all the open requests
    req_arr = Client.get_open_requests_with_accepted_offers(client).get("requests")

    if len(req_arr) != 0:
        data_obj = {"open":[], "accepted":[],"ongoing":[]}
        for req in req_arr:
            obj = {}
            obj['id'] = req.get('id')
            obj['name'] = req.get('details').split("$$")[0]
            status = req.get('status')

            

            if(status == 'open' and ("offers" not in req)):
                data_obj["open"].append(obj)
            elif(status == 'open'):
                obj['offers'] = []
                for offer in req.get('offers'):
                    obj.get("offers").append({"name":offer.get("name"),"rating":"rating-"+str(offer.get("rating")),"id":offer.get("id")})
                data_obj["accepted"].append(obj)
            elif(status == 'ongoing'):
                obj['pro_name'] = req.get('professional').get("name")
                obj['phone'] = req.get('professional').get("phone")
                obj['email'] = req.get('professional').get("email")
                data_obj["ongoing"].append(obj)
                
    return render(request,"client_ongoing_base.html",data_obj)

def acceptOffer(request):
    id = request.session.get('userID')
    client = Client.get_client_by_id(id)
    if(client is None):
        return index(request)
    
    
    offer = request.POST.get("offerId")

    Offer.get_offer_by_id(offer).accept_offer()

    return HttpResponse("success")