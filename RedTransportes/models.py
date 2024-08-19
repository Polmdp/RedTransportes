from django.db import models
# Create your models here.
from django.db import models
import datetime
class Remolque(models.Model):
    matricula = models.BigIntegerField(primary_key=True)
    peso= models.FloatField()
    pesocarga= models.FloatField(default=0)

class Localidad(models.Model):
    nombre = models.CharField(max_length=255)
class Pedido(models.Model):
    fechapedido = models.DateTimeField(default=datetime.datetime.now)

class Paquete(models.Model):
    peso = models.FloatField()
    tamaño = models.FloatField()
    localidad_fin = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)  # Relación de muchos paquetes a un pedido

class Cliente(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    dni = models.BigIntegerField()
    telefono = models.BigIntegerField()
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)


class Conductor(models.Model):
    id = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=255)
    dni = models.BigIntegerField()
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    telefono = models.BigIntegerField()

    def get_extra_cost(self):
        #
        # "solo si es 3ro" , aca iria el desarrollo de esta funcion.

        pass