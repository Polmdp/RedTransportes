from django.db import models

# Create your models here.


from django.db import models

class Conductor(models.Model):
    id = models.BigIntegerField(primary_key=True)
    nombre = models.CharField(max_length=255)
    dni = models.BigIntegerField()
    direccion = models.CharField(max_length=255)
    provincia = models.CharField(max_length=255)
    poblacion = models.CharField(max_length=255)
    telefono = models.BigIntegerField()

    def get_extra_cost(self):
        #
        # "solo si es 3ro" , aca iria el desarrollo de esta funcion.

        pass