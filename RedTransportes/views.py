from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conductor, Localidad, Cliente, Pedido
from .serializers import ConductorSerializer, LocalidadSerializer, ClienteSerializer, PedidoSerializer, \
    PaqueteSerializer


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