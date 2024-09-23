from django.db import models
from django.contrib.auth.models import User
import datetime

class Localidad(models.Model):
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class Cliente(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    dni = models.CharField(max_length=20)
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

class Remolque(models.Model):
    matricula = models.CharField(max_length=20, primary_key=True)
    peso = models.FloatField()
    pesocarga = models.FloatField(default=0)

    def __str__(self):
        return f"Remolque {self.matricula}"

class Camion(models.Model):
    fechadeAlta = models.DateTimeField(auto_now_add=True)
    matricula = models.CharField(max_length=20, primary_key=True)
    pesomaximo = models.FloatField()

    def __str__(self):
        return f"Camion {self.matricula}"

class Conductor(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    dni = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    telefono = models.CharField(max_length=20)

    def get_extra_cost(self):
        return 0.0

    def __str__(self):
        return self.nombre

class ConductorParticular(Conductor):
    tarifa = models.FloatField()
    camion = models.ForeignKey(Camion, on_delete=models.SET_NULL, null=True)

    def get_extra_cost(self):
        # Implement the logic for extra cost calculation
        return self.tarifa

    def __str__(self):
        return f"{self.nombre} - Tarifa: {self.tarifa}"

class Ruta(models.Model):
    distancia = models.FloatField()
    localidad_inicio = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True, related_name='rutas_como_inicio')
    localidad_fin = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True, related_name='rutas_como_fin')
    tiempo_recorrido = models.DurationField()

    def __str__(self):
        return f"Ruta de {self.localidad_inicio} a {self.localidad_fin}"

class Pedido(models.Model):
    fechapedido = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)

    def getPrice(self):
        total_price = sum(paquete.getPrice() for paquete in self.paquete_set.all())
        return total_price

    def __str__(self):
        return f"Pedido {self.id} de {self.cliente}"

class Paquete(models.Model):
    peso = models.FloatField()
    tamaño = models.FloatField()
    localidad_fin = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.SET_NULL, null=True)

    def getPrice(self):
        base_price = 5.0
        weight_price = self.peso * 2.0
        size_price = self.tamaño * 1.5
        return base_price + weight_price + size_price

    def __str__(self):
        return f"Paquete {self.id} del Pedido {self.pedido.id}"

class HojaDeRuta(models.Model):
    volumen_carga = models.FloatField(default=0)
    fecha_partida = models.DateTimeField(auto_now_add=True)
    fecha_destino = models.DateTimeField()
    ruta = models.ForeignKey(Ruta, on_delete=models.SET_NULL, null=True)
    conductor = models.ForeignKey(Conductor, on_delete=models.SET_NULL, null=True)
    pedidos = models.ManyToManyField(Pedido, blank=True)

    def getCost(self):
        cost_per_km = 1.0  # Adjust as necessary
        base_cost = self.ruta.distancia * cost_per_km
        extra_cost = self.conductor.get_extra_cost()
        total_cost = base_cost + extra_cost
        return total_cost

    def getSpace(self, new_pedido):
        if hasattr(self.conductor, 'camion') and self.conductor.camion:
            max_capacity = self.conductor.camion.pesomaximo
        else:
            max_capacity = 0  # Or some default value
        current_load = sum(
            paquete.peso for pedido in self.pedidos.all()
            for paquete in pedido.paquete_set.all()
        )
        new_load = sum(paquete.peso for paquete in new_pedido.paquete_set.all())
        return (current_load + new_load) <= max_capacity

    def addPedido(self, pedido):
        if self.getSpace(pedido):
            self.pedidos.add(pedido)
            self.volumen_carga += sum(paquete.peso for paquete in pedido.paquete_set.all())
            self.save()
            return True
        else:
            return False

    def __str__(self):
        return f"HojaDeRuta {self.id} - Conductor: {self.conductor}"

class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    dni = models.CharField(max_length=20)
    direccion = models.CharField(max_length=255)
    localidad = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)
    telefono = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return self.nombre

    # You don't need an authenticate method here; use Django's authentication system
