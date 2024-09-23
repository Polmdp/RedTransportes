from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conductor, Localidad
from .serializers import ConductorSerializer, LocalidadSerializer


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