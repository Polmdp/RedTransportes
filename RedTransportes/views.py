from datetime import timedelta

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
    def get(self, request):
        pedidos = Pedido.objects.all()
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PedidoSerializer(data=request.data)
        if serializer.is_valid():
            pedido = serializer.save()

            hoja_asignada = None
            dias_a_verificar = 0

            while not hoja_asignada:
                fecha_verificar = timezone.now().date() + timedelta(days=dias_a_verificar)
                hojas_ruta_existente = HojaDeRuta.objects.filter(fecha_partida__date=fecha_verificar)

                if hojas_ruta_existente.exists():
                    # Verificar si alguna hoja de ruta tiene espacio para el pedido
                    for hoja in hojas_ruta_existente:
                        if hoja.getSpace(pedido):
                            hoja.addPedido(pedido)
                            hoja_asignada = hoja
                            break
                    if not hoja_asignada:
                        dias_a_verificar += 1
                else:
                    nueva_hoja_ruta = HojaDeRuta.objects.create(
                        fecha_partida=timezone.now().date() + timedelta(days=dias_a_verificar),  # Usar timezone.now()
                        fecha_destino=timezone.now() + timedelta(days=dias_a_verificar, hours=5),  # Usar timezone.now()
                        conductor=self.get_available_driver(),  # Lógica para asignar conductor
                        ruta=self.get_route_for_pedido(pedido),  # Lógica para obtener la ruta
                    )
                    nueva_hoja_ruta.pedidos.add(pedido)  # Aquí aseguras que se asocia el pedido a la hoja de ruta
                    nueva_hoja_ruta.save()
                    hoja_asignada = nueva_hoja_ruta
            return Response(PedidoSerializer(pedido).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_available_driver(self):
        # Implementa lógica para seleccionar un conductor disponible
        return Conductor.objects.first()

    def get_route_for_pedido(self, pedido):
        # Implementa la lógica para seleccionar la ruta en base al pedido
        return Ruta.objects.first()
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