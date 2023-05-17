from django.db import models
from utils import constant_converter
from professional.models import Professional

class Client(models.Model):
    email = models.EmailField(primary_key=True)
    name = models.CharField(max_length=255)
    membership = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    account = models.TextField()

    @classmethod
    def create(cls, name, membership, email, password, phone, account):
        client = cls(name=name, membership=membership, email=email, password=password, phone=phone, account=account)
        client.save()
        return client
    
    @classmethod
    def authenticate(cls, email, password):
        try:
            client = cls.objects.get(email=email, password=password)
            return client
        except cls.DoesNotExist:
            return None
    
    @classmethod
    def get_open_requests_with_accepted_offers(client):
        result = {}

        open_requests = Request.get_open_requests_by_client(client)
        if open_requests :
            result['requests'] = []
            for request in open_requests:
                request_obj = request.to_json()
                offers = request.get_offers_accepted()
                if offers:
                    request_obj['offers'] = []
                    for offer in offers:
                        request_obj.offers.append(offer.professional.to_json())
                result.requests.append(request_obj)
            
        return result
    
    def __str__(self):
        return self.email
    
    def to_json(self):
        client_data = {
            "id": self.id,
            "name": self.name,
            "membership": self.membership,
            "email": self.email,
            "password": self.password,
            "phone": self.phone,
            "account": self.account,
        }

        return json.dumps(client_data)
    
class Request(models.Model):
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, null=True, blank=True, on_delete=models.SET_NULL)
    location = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=255)
    rating = models.SmallIntegerField()
    comment = models.TextField()
    
    @classmethod
    def create_request(cls, client, location, amount):
        request = cls(client=client, location=location, amount=amount, status='open')
        request.save()
        return request

    @classmethod
    def get_requests_by_client(cls, client):
        return cls.objects.filter(client=client)

    def update_professional(self, professional):
        self.professional = professional
        self.save()

    def update_status(self, status):
        self.status = status
        self.save()

    def update_rating_comment(self, rating, comment):
        self.rating = rating
        self.comment = comment
        self.save()

    def get_offers_accepted(self):
        offers = Offer.objects.filter(request=self,status='accepted')
        return offers

    @classmethod
    def get_closed_requests_by_client(cls, client):
        return cls.objects.filter(client=client, status='closed')
    
    @classmethod
    def get_ongoing_requests_by_client(cls, client):
        return cls.objects.filter(client=client, status='ongoing')
    
    @classmethod
    def get_open_requests_by_client(cls, client):
        return cls.objects.filter(client=client, status='open')

    @classmethod
    def get_closed_requests_by_professional(cls, professional):
        return cls.objects.filter(professional=professional, status='closed')
    
    @classmethod
    def get_ongoing_requests_by_professional(cls, professional):
        return cls.objects.filter(professional=professional, status='ongoing')

    def __str__(self):
        return f"Request #{self.id}"
    
    def to_json(self):
        request_data = {
            "id": self.id,
            "client": self.client.to_json(),
            "professional": self.professional.to_json() if self.professional else None,
            "location": self.location,
            "amount": str(self.amount),
            "status": self.status,
            "rating": self.rating,
            "comment": self.comment,
        }
        return json.dumps(request_data)

    
class Offer(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    status = models.CharField(max_length=255)

    @classmethod
    def get_offer_by_id(cls, offer_id):
        try:
            offer = cls.objects.get(pk=offer_id)
            return offer
        except cls.DoesNotExist:
            return None

    @classmethod
    def publish_offers(cls, request, professionals):
        offers = []
        for professional in professionals:
            offer = cls(request=request, professional=professional, status='open')
            offer.save()
            offers.append(offer)
        return offers
    
    @classmethod
    def get_open_accepted_offers(cls, professional):
        open_offers = cls.objects.filter(professional=professional, status='open')
        accepted_offers = cls.objects.filter(professional=professional, status='accepted')

        open_request_ids = open_offers.values_list("request", flat=True)
        accepted_request_ids = accepted_offers.values_list("request", flat=True)

        open_requests = Request.objects.filter(id__in=open_request_ids)
        accepted_requests = Request.objects.filter(id__in=accepted_request_ids)

        return {"open": open_requests, "accepted": accepted_requests}
    
    @classmethod
    def delete_offers_by_request(cls, req):
        offers = cls.objects.filter(request = req)

        for offer in offers:
            offer.reject_offer()

    
    def bid(self):
        self.status = 'accepted'
        self.save()

    def reject_offer(self):
        self.delete()

    @classmethod
    def accept_offer(cls, offer):
        professional = offer.professional
        request = offer.request

        request.professional = professional
        request.status = "ongoing"

        Offer.delete_offers_by_request(request)
    

    
    def __str__(self):
        return f"Offer {self.id}"
    
    def to_json(self):
        offer_data = {
            "id": self.id,
            "request": self.request.to_json(),
            "professional": self.professional.to_json(),
            "status": self.status,
        }
        return json.dumps(offer_data)