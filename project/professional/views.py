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

def fetchJobs(request):
    id = request.session.get('userID')
    professional = Professional.get_professiona_by_id(id)
    if(professional is None):
        return index(request)

    #Fetch all open offers
    offer_dict = Offer.get_open_offer_ids_with_requests(professional)

    requests = []
    #print(len(offer_dict[2]))
    if(len(offer_dict[2])!=0):
        for key,value in offer_dict[2].items():
            obj = value.to_json()
            obj['offer'] = key
            requests.append(obj)

        data = {"contents":[]}

        for req in requests:
            obj = {}
            details = req.get("details")
            
            obj['id'] = req.get('offer')
            obj['name'] = req.get('details').split("$$")[0]
            obj['location'] = req.get("location")

            extra = "Client Name: "+ req.get('client').get("name") + "$$Location: "+ req.get("location") + "$$Estimated fee: "+ req.get("amount")
            extra += "$$" + details.split("$$",1)[1]
            obj['extra'] = extra

            data.get("contents").append(obj)

        return render(request,"pro_home_entry.html",data)

    

    return HttpResponse("empty")

def fetchOngoingJobs(request):
    id = request.session.get('userID')
    professional = Professional.get_professiona_by_id(id)
    if(professional is None):
        return index(request)

    #Fetch all open offers
    requests_dict = Request.get_ongoing_requests_by_professional(professional)

    requests = []
    if(len(requests_dict)!=0):
        data = {"contents":[]}

        for req_ in requests_dict:
            obj = {}
            req = req_.to_json()
            details = req.get("details")
            
            obj['id'] = req.get('offer')
            obj['name'] = req.get('details').split("$$")[0]
            obj['location'] = req.get("location")

            extra = "Client Name: "+ req.get('client').get("name") + "$$Location: "+ req.get("location") + "$$Estimated fee: "+ req.get("amount")
            extra += "$$" + details.split("$$",1)[1]
            obj['extra'] = extra

            data.get("contents").append(obj)

        return render(request,"pro_ongoing_entry.html",data)

    

    return HttpResponse("empty")

    #return HttpResponse(requests_dict)





def acceptJob(request):
    id = request.session.get('userID')
    professional = Professional.get_professiona_by_id(id)
    if(professional is None):
        return index(request)
    
    offer_id = request.POST.get("offer_id")
    Offer.get_offer_by_id(offer_id).bid()

    return HttpResponse("success")

def rejectJob(request):
    id = request.session.get('userID')
    professional = Professional.get_professiona_by_id(id)
    if(professional is None):
        return index(request)
    
    offer_id = request.POST.get("offer_id")
    offer = Offer.get_offer_by_id(offer_id)
    offer.reject_offer()

    return HttpResponse("success")