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
    email = models.EmailField(max_length=100)
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
    tiempo_recorrido = models.DurationField()
    localidad_inicio = models.ForeignKey(
        Localidad, on_delete=models.SET_NULL, null=True, blank=True, related_name='rutas_inicio'
    )
    localidad_fin = models.ForeignKey(
        Localidad, on_delete=models.SET_NULL, null=True, blank=True, related_name='rutas_fin'
    )
    localidades_intermedias = models.ManyToManyField(
        Localidad, related_name='rutas_intermedias', blank=True
    )

    def __str__(self):
        localidades_nombres = ', '.join(
            localidad.nombre for localidad in self.localidades()
        )
        return f"Ruta: {localidades_nombres}"

    def localidades(self):
        # Retorna una lista de todas las localidades por las que pasa la ruta
        localidades = []
        if self.localidad_inicio:
            localidades.append(self.localidad_inicio)
        localidades += list(self.localidades_intermedias.all())
        if self.localidad_fin:
            localidades.append(self.localidad_fin)
        return localidades


class Pedido(models.Model):
    STATUS_CHOICES = [
        ('CREADO', 'Creado'),
        ('EN_RUTA', 'En Ruta'),
        ('ENTREGADO', 'Entregado'),
        ('CANCELADO', 'Cancelado'),
    ]

    fechapedido = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='CREADO'
    )
    def getPrice(self):
        total_price = sum(paquete.getPrice() for paquete in self.paquetes.all())
        return total_price

class Paquete(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='paquetes', on_delete=models.CASCADE)
    peso = models.FloatField()
    tamaño = models.FloatField()
    localidad_fin = models.ForeignKey(Localidad, on_delete=models.SET_NULL, null=True, blank=True)

    def getPrice(self):
        base_price = 5.0
        weight_price = self.peso * 2.0
        size_price = self.tamaño * 1.5
        return base_price + weight_price + size_price

class HojaDeRuta(models.Model):
    volumen_carga = models.FloatField(default=0)
    fecha_partida = models.DateTimeField(auto_now_add=True)
    fecha_destino = models.DateTimeField()
    ruta = models.ForeignKey(Ruta, on_delete=models.SET_NULL, null=True)
    conductor = models.ForeignKey(Conductor, on_delete=models.SET_NULL, null=True)
    pedidos = models.ManyToManyField(Pedido, blank=True)

    def getCost(self):
        cost_per_km = 1.0  # Ajusta según sea necesario
        base_cost = self.ruta.distancia * cost_per_km
        extra_cost = self.conductor.get_extra_cost()
        total_cost = base_cost + extra_cost
        return total_cost

    def getSpace(self, new_pedido):
        max_capacity = (
            self.conductor.camion.pesomaximo
            if hasattr(self.conductor, 'camion') and self.conductor.camion
            else 100
        )
        current_load = sum(
            paquete.peso
            for pedido in self.pedidos.all()
            for paquete in pedido.paquetes.all()
        )
        new_load = sum(paquete.peso for paquete in new_pedido.paquetes.all())
        return (current_load + new_load) <= max_capacity

    def is_localidad_on_route(self, localidad):
        return localidad in self.ruta.localidades()

    def addPedido(self, pedido):
        if not self.getSpace(pedido):
            return False  # No hay espacio suficiente

        # Verificar si todas las localidades destino de los paquetes están en la ruta
        for paquete in pedido.paquetes.all():
            if not self.is_localidad_on_route(paquete.localidad_fin):
                return False  # La localidad destino no está en la ruta

        self.pedidos.add(pedido)
        self.volumen_carga += sum(paquete.peso for paquete in pedido.paquetes.all())
        self.save()
        return True

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
