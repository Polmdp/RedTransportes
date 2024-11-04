from datetime import timedelta

from django.db import models
from django.db.models import Q

from django.http import Http404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conductor, Localidad, Cliente, Pedido, HojaDeRuta, Ruta
from .serializers import ConductorSerializer, LocalidadSerializer, ClienteSerializer, PedidoSerializer, \
    PaqueteSerializer, HojaDeRutaSerializer


class ConductorListCreateAPIView(APIView):
    def get(self, request):
        conductores = Conductor.objects.all()
        serializer = ConductorSerializer(conductores, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ConductorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConductorDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Conductor.objects.get(pk=pk)
        except Conductor.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        print("Test")
        conductor = self.get_object(pk)
        serializer = ConductorSerializer(conductor)
        return Response(serializer.data)

    def put(self, request, pk):
        conductor = self.get_object(pk)
        serializer = ConductorSerializer(conductor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        conductor = self.get_object(pk)
        conductor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LocalidadesListCreateAPIView(APIView):
    def get(self, request):
        localidades = Localidad.objects.all()
        serializer = LocalidadSerializer(localidades, many=True)
        return Response(serializer.data)

class HojaDeRutaAPIView(APIView):
    def get(self,request):
        hojasderuta=HojaDeRuta.objects.all()
        serializer_hojaderuta=HojaDeRutaSerializer(hojasderuta,many=True)
        return Response(serializer_hojaderuta.data)


class ClienteListCreateAPIView(APIView):
    def get(self, request):
        clientes = Cliente.objects.all()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClienteDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        cliente = self.get_object(pk)
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)

    def put(self, request, pk):
        cliente = self.get_object(pk)
        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cliente = self.get_object(pk)
        cliente.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PedidoListCreateAPIView(APIView):
    def get_available_driver(self):
        # Lógica para seleccionar un conductor disponible (ajustar según tus reglas)
        return Conductor.objects.first()

    def get_route_for_pedido(self, localidad_inicio, localidad_fin):
        # Buscar una ruta donde la localidad de inicio sea el hub (localidad 3)
        # y la localidad de destino pueda ser la localidad final o una localidad intermedia.
        ruta = Ruta.objects.filter(
            localidad_inicio=localidad_inicio
        ).filter(
            Q(localidad_fin=localidad_fin) | Q(localidades_intermedias=localidad_fin)
        ).first()

        if ruta is None:
            # Si no se encuentra una ruta adecuada, lanzar un error o manejarlo de forma específica.
            raise ValueError(f"No se encontró una ruta que incluya la localidad de destino {localidad_fin}")

        return ruta

    def post(self, request):
        serializer = PedidoSerializer(data=request.data)
        if serializer.is_valid():
            pedido = serializer.save()
            pedido.status = 'CREADO'
            pedido.save()
            dias_a_verificar = 0

            # Iterar sobre cada paquete para asignarlo a una HojaDeRuta
            for paquete in pedido.paquetes.all():
                hoja_asignada = None

                while not hoja_asignada:
                    fecha_verificar = timezone.now().date() + timedelta(days=dias_a_verificar)

                    # Verificar si existe alguna HojaDeRuta para la ruta y fecha especificada
                    try:
                        ruta = self.get_route_for_pedido(localidad_inicio=3, localidad_fin=paquete.localidad_fin)
                        hojas_ruta_existente = HojaDeRuta.objects.filter(
                            fecha_partida__date=fecha_verificar,
                            ruta=ruta
                        )
                    except ValueError as e:
                        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

                    if hojas_ruta_existente.exists():
                        # Buscar una hoja de ruta que tenga espacio y acepte la localidad
                        for hoja in hojas_ruta_existente:
                            if hoja.getSpace(pedido) and hoja.is_localidad_on_route(paquete.localidad_fin):
                                hoja.addPedido(pedido)
                                hoja_asignada = hoja
                                pedido.status = 'EN_RUTA'
                                pedido.save()
                                break

                        # Si no hay una hoja de ruta adecuada, aumentar los días
                        if not hoja_asignada:
                            dias_a_verificar += 1
                    else:
                        # Si no hay hojas de ruta, crear una nueva
                        nueva_hoja_ruta = HojaDeRuta.objects.create(
                            fecha_partida=timezone.now().date() + timedelta(days=dias_a_verificar),
                            fecha_destino=timezone.now() + timedelta(days=dias_a_verificar, hours=5),
                            conductor=self.get_available_driver(),
                            ruta=ruta,
                        )

                        # Verificar si la nueva hoja de ruta puede aceptar el paquete
                        if nueva_hoja_ruta.is_localidad_on_route(paquete.localidad_fin):
                            nueva_hoja_ruta.pedidos.add(pedido)
                            nueva_hoja_ruta.save()
                            hoja_asignada = nueva_hoja_ruta
                        else:
                            nueva_hoja_ruta.delete()
                            dias_a_verificar += 1

            return Response(PedidoSerializer(pedido).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PedidoDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Pedido.objects.get(pk=pk)
        except Pedido.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        pedido = self.get_object(pk)
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)

    def put(self, request, pk):
        pedido = self.get_object(pk)
        serializer = PedidoSerializer(pedido, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        pedido = self.get_object(pk)
        pedido.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)