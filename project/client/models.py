from django.db import models
from utils import constant_converter
from professional.models import Professional

# Create your models here.
class Client(models.Model):
    email = models.EmailField(primary_key=True)
    name = models.CharField(max_length=255)
    membership = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    account = models.TextField()

    def __str__(self):
        return self.email
    
class Request(models.Model):
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, null=True, blank=True, on_delete=models.SET_NULL)
    location = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=255)
    rating = models.SmallIntegerField()
    comment = models.TextField()
    

    def __str__(self):
        return f"Request #{self.id}"
    
class Offer(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    status = models.CharField(max_length=255)

    def __str__(self):
        return f"Offer {self.id}"



