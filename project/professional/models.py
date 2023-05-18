from django.db import models
import json

class Professional(models.Model):
    email = models.EmailField(primary_key=True)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    account = models.TextField()
    services = models.TextField()

    @classmethod
    def create(cls, email, name, password, phone, account, services):
        professional = cls(email=email, name=name, password=password, phone=phone, account=account, services=services)
        professional.save()
        return professional
    
    @classmethod
    def get_professiona_by_id(cls, email):
        try:
            prof = cls.objects.get(pk=email)
            return prof
        except cls.DoesNotExist:
            return None

    @classmethod
    def authenticate(cls, email, password):
        try:
            professional = cls.objects.get(email=email, password=password)
            return professional
        except cls.DoesNotExist:
            return None
        
    @classmethod
    def get_professionals_by_service(cls, service_number):
        return cls.objects.filter(services__contains=f"{service_number}")

    def __str__(self):
        return self.email
    
    def to_json(self):
        professional_data = {
            "email": self.email,
            "name": self.name,
            "password": self.password,
            "phone": self.phone,
            "account": self.account,
            "services": self.services,
        }
        return professional_data