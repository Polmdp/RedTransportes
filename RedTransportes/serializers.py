from rest_framework import serializers
from .models import Conductor, Localidad, Cliente, Paquete, Pedido, HojaDeRuta, Ruta


class ConductorSerializer(serializers.ModelSerializer):
    localidad_nombre= serializers.SerializerMethodField()
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Conductor
        fields = '__all__'
    def get_localidad_nombre(self,obj):
        return obj.localidad.nombre if obj.localidad else ""

    def get_nombre_completo(self,obj):
        return f"{obj.nombre} {obj.apellido}"

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
    localidad_fin_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Paquete
        fields = ['id', 'peso', 'tamaño', 'localidad_fin', 'localidad_fin_nombre']

    def get_localidad_fin_nombre(self, obj):
        return obj.localidad_fin.nombre if obj.localidad_fin else ""

class PedidoSerializer(serializers.ModelSerializer):
    paquetes = PaqueteSerializer(many=True, required=False)
    destinos = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = ['id', 'fechapedido', 'cliente', 'paquetes', 'destinos', 'status']

    def get_destinos(self, obj):
        destinos = set(paquete.localidad_fin.nombre for paquete in obj.paquetes.all() if paquete.localidad_fin)
        return list(destinos)

    def get_status(self, obj):
        return {
            'code': obj.status,
            'display': obj.get_status_display(),
            'descripcion': self.get_status_description(obj.status)
        }

    def get_status_description(self, status):
        descriptions = {
            'CREADO': 'El pedido ha sido creado y está pendiente de procesamiento',
            'EN_RUTA': 'El pedido está en camino a su destino',
            'ENTREGADO': 'El pedido ha sido entregado exitosamente',
            'CANCELADO': 'El pedido ha sido cancelado'
        }
        return descriptions.get(status, 'Estado desconocido')


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


class RutaSerializer(serializers.ModelSerializer):
    localidad_inicio = LocalidadSerializer()
    localidades_intermedias = LocalidadSerializer(many=True)
    localidad_fin = LocalidadSerializer()

    class Meta:
        model = Ruta
        fields = ['id', 'localidad_inicio', 'localidades_intermedias', 'localidad_fin']
class HojaDeRutaSerializer(serializers.ModelSerializer):
    ruta = RutaSerializer()
    pedidos = PedidoSerializer(many=True, required=False)
    conductor = ConductorSerializer()
    class Meta:
        model = HojaDeRuta
        fields = ['id', 'ruta', 'fecha_partida', 'fecha_destino', 'conductor', 'pedidos']

    def create(self, validated_data):
        pedidos_data = validated_data.pop('pedidos', [])
        hoja_de_ruta = HojaDeRuta.objects.create(**validated_data)
        for pedido_data in pedidos_data:
            paquetes_data = pedido_data.pop('paquetes', [])
            pedido = Pedido.objects.create(hoja_de_ruta=hoja_de_ruta, **pedido_data)
            for paquete_data in paquetes_data:
                Paquete.objects.create(pedido=pedido, **paquete_data)
        return hoja_de_ruta


