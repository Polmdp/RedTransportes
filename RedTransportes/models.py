from django.db import models
# Create your models here.
from django.contrib.auth.models import User
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
    pedido = models.ForeignKey(Pedido,on_delete=models.SET_NULL)  # Relación de muchos paquetes a un pedido

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
class Ruta(models.Model):
    distancia = models.BigIntegerField()
    localidad_inicio = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    localidad_fin = models.ForeignKey(Localidad, on_delete=models.SET_NULL)
    tiempo_recorrido = models.DateTimeField()

class Camion(models.Model):
    fechadeAlta = models.DateTimeField(default=datetime.datetime.now)
    matricula = models.BigIntegerField(primary_key=True)
    pesomaximo = models.FloatField()
class HojaDeRuta(models.Model):
    volumen_carga = models.BigIntegerField(default=0)
    fecha_partida = models.DateTimeField(default=datetime.datetime.now)
    fecha_destino = models.DateTimeField(default=datetime.datetime.now)
    ruta = models.ForeignKey(Ruta,on_delete=models.SET_NULL)
    conductor = models.ForeignKey(Conductor,on_delete=models.SET_NULL)
    def getCost(self):
        #Obtener el costo
        return
    def getSpace(self):
        #Devolver un boolean si el pedido tiene espacio
        return
    def addPedido(self):
        #Agregar un pedido
        return
    def toString(self):
        return str(self)
class ConductorParticular(Conductor):
    tarifa = models.FloatField()
    camion = models.ForeignKey(Camion, on_delete=models.SET_NULL)
    def __str__(self):
        return f"{self.nombre} - Tarifa: {self.tarifa}"


class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    dni = models.BigIntegerField()
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    telefono = models.BigIntegerField()
    email = models.EmailField()
    def authenticate(self):
        #No se que va
        return