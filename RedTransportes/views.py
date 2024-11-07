
from django.db.models import Q
from datetime import timedelta
from django.http import Http404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conductor, Localidad, Cliente, Pedido, HojaDeRuta, Ruta
from .serializers import ConductorSerializer, LocalidadSerializer, ClienteSerializer, PedidoSerializer, \
    PaqueteSerializer, HojaDeRutaSerializer, ConductorParticularSerializer, CamionSerializer

import logging

logger = logging.getLogger(__name__)


class ConductorListCreateAPIView(APIView):
    def get(self, request):
        conductores = Conductor.objects.all()
        serializer = ConductorSerializer(conductores, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            logger.debug("Recibiendo solicitud POST para agregar conductor.")
            # Extraer los datos del request
            conductor_data = request.data.get('conductor')
            camion_particular_data = request.data.get('camionParticular')

            logger.debug(f"Datos recibidos: Conductor: {conductor_data}, Camión Particular: {camion_particular_data}")

            # Verificar si hay datos para el camión particular
            if camion_particular_data:
                # Crear camión
                camion_data = {
                    'matricula': camion_particular_data.get('camion_matricula'),
                    'pesomaximo': camion_particular_data.get('camion_pesomaximo'),
                    'fechadeAlta': timezone.now(),
                }
                logger.debug(f"Creando camión con los siguientes datos: {camion_data}")

                camion_serializer = CamionSerializer(data=camion_data)
                if camion_serializer.is_valid():
                    camion = camion_serializer.save()  # Guardar el camión
                    logger.debug(f"Camión creado: {camion.matricula}")

                    # Crear conductor particular
                    particular_data = {
                        'nombre': conductor_data.get('nombre'),
                        'apellido': conductor_data.get('apellido'),
                        'dni': conductor_data.get('dni'),
                        'direccion': conductor_data.get('direccion'),
                        'localidad': conductor_data.get('localidad'),
                        'telefono': conductor_data.get('telefono'),
                        'tarifa': camion_particular_data.get('tarifa'),
                        'camion': camion.matricula,  # Asociar el camión al conductor particular usando el ID del camión
                    }
                    logger.debug(f"Creando conductor particular con los siguientes datos: {particular_data}")

                    # Crear el conductor particular
                    particular_serializer = ConductorParticularSerializer(data=particular_data)
                    if particular_serializer.is_valid():
                        particular_serializer.save()  # Guardar conductor particular
                        logger.debug("Conductor particular creado exitosamente.")
                        return Response(particular_serializer.data, status=status.HTTP_201_CREATED)
                    else:
                        logger.error(f"Error al crear conductor particular: {particular_serializer.errors}")
                        camion.delete()  # Eliminar el camión si algo falla
                        return Response(particular_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    logger.error(f"Error al crear camión: {camion_serializer.errors}")
                    return Response(camion_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Si el conductor no es particular, crear solo el conductor sin el camión
                conductor_data = {
                    'nombre': conductor_data.get('nombre'),
                    'apellido': conductor_data.get('apellido'),
                    'dni': conductor_data.get('dni'),
                    'direccion': conductor_data.get('direccion'),
                    'localidad': conductor_data.get('localidad'),
                    'telefono': conductor_data.get('telefono'),
                }
                logger.debug(f"Creando conductor con los siguientes datos: {conductor_data}")

                # Crear el conductor
                conductor_serializer = ConductorSerializer(data=conductor_data)
                if conductor_serializer.is_valid():
                    conductor_serializer.save()  # Guardar conductor
                    logger.debug("Conductor creado exitosamente.")
                    return Response(conductor_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    logger.error(f"Error al crear conductor: {conductor_serializer.errors}")
                    return Response(conductor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error inesperado: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        # Usamos el serializador para validar los datos
        serializer = ClienteSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():

            # Guardamos el cliente si los datos son válidos
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Si no es válido, respondemos con un error detallado
        return Response({
            "error": "Datos de cliente incorrectos",
            "detail": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
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
    def get_available_driver(self, fecha):
        # Buscar un conductor disponible que no esté asignado a otra HojaDeRuta en la fecha dada
        conductor = Conductor.objects.exclude(
            hojaderuta__fecha_destino__day=fecha.day,
            hojaderuta__fecha_destino__month=fecha.month,
            hojaderuta__fecha_destino__year=fecha.year,

        ).first()  # Ajusta la lógica de selección según tus necesidades

        if conductor:
            # Marcar al conductor como no disponible temporalmente para evitar conflictos
            conductor.disponible = False
            conductor.save()
        return conductor



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

            for paquete in pedido.paquetes.all():
                hoja_asignada = None

                while not hoja_asignada:
                    fecha_verificar = timezone.now().date() + timedelta(days=dias_a_verificar)

                    try:
                        ruta = self.get_route_for_pedido(localidad_inicio=3, localidad_fin=paquete.localidad_fin)
                        hojas_ruta_existente = HojaDeRuta.objects.filter(
                            fecha_partida__date=fecha_verificar,
                            ruta=ruta
                        )
                    except ValueError as e:
                        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

                    if hojas_ruta_existente.exists():
                        for hoja in hojas_ruta_existente:
                            if hoja.getSpace(pedido) and hoja.is_localidad_on_route(paquete.localidad_fin):
                                hoja.addPedido(pedido)
                                hoja_asignada = hoja
                                pedido.status = 'EN_RUTA'
                                pedido.save()
                                break

                        if not hoja_asignada:
                            dias_a_verificar += 1
                    else:
                        conductor = self.get_available_driver(fecha_verificar)
                        if not conductor:
                            return Response({"error": "No hay conductores disponibles"}, status=status.HTTP_400_BAD_REQUEST)

                        nueva_hoja_ruta = HojaDeRuta.objects.create(
                            fecha_partida=timezone.now().date() + timedelta(days=dias_a_verificar),
                            fecha_destino=timezone.now() + timedelta(days=dias_a_verificar, hours=5),
                            conductor=conductor,
                            ruta=ruta,
                        )

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