from django.contrib import admin
from .models import Camion, Conductor, Cliente, Pedido, Paquete, ConductorParticular, HojaDeRuta, Ruta, Localidad

# Register your models here.
admin.site.register(Camion)
admin.site.register(Conductor)
admin.site.register(Pedido)
admin.site.register(Paquete)
admin.site.register(ConductorParticular)
admin.site.register(Cliente)
admin.site.register(HojaDeRuta)
admin.site.register(Ruta)
admin.site.register(Localidad)
