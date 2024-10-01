from rest_framework import serializers
from .models import Conductor, Localidad, Cliente, Paquete, Pedido, HojaDeRuta


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


class ClienteSerializer(serializers.ModelSerializer):
    localidad_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = '__all__'

    def get_localidad_nombre(self, obj):
        return obj.localidad.nombre if obj.localidad else ""


class PaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquete
        fields = ['id', 'peso', 'tamaño', 'localidad_fin']

class PedidoSerializer(serializers.ModelSerializer):
    paquetes = PaqueteSerializer(many=True, required=False)

    class Meta:
        model = Pedido
        fields = ['id', 'fechapedido', 'cliente', 'paquetes']

    def create(self, validated_data):
        paquetes_data = validated_data.pop('paquetes', [])
        pedido = Pedido.objects.create(**validated_data)
        for paquete_data in paquetes_data:
            Paquete.objects.create(pedido=pedido, **paquete_data)
        return pedido

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['precio_total'] = instance.getPrice()
        return representation

class HojaDeRutaSerializer(serializers.ModelSerializer):
    pedidos = PedidoSerializer(many=True, required=False)
    class Meta:
        model = HojaDeRuta
        fields = ['id', 'fecha_partida', 'fecha_destino', 'conductor', 'pedidos']

    def create(self, validated_data):
        pedidos_data = validated_data.pop('pedidos', [])
        hoja_de_ruta = HojaDeRuta.objects.create(**validated_data)
        for pedido_data in pedidos_data:
            paquetes_data = pedido_data.pop('paquetes', [])
            pedido = Pedido.objects.create(hoja_de_ruta=hoja_de_ruta, **pedido_data)
            for paquete_data in paquetes_data:
                Paquete.objects.create(pedido=pedido, **paquete_data)
        return hoja_de_ruta