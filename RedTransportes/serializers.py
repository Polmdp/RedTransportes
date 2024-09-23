from rest_framework import serializers
from .models import Conductor,Localidad

class ConductorSerializer(serializers.ModelSerializer):
    localidad_nombre= serializers.SerializerMethodField()
    class Meta:
        model = Conductor
        fields = '__all__'
    def get_localidad_nombre(self,obj):
        return obj.localidad.nombre if obj.localidad else ""

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'
