from django.db import models

class Professional(models.Model):
    email = models.EmailField(primary_key=True)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    account = models.TextField()
    services = models.TextField()

    def __str__(self):
        return self.email