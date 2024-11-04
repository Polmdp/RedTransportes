# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Pedido


@receiver(post_save, sender=Pedido)
def notify_pedido_status_change(sender, instance, created, **kwargs):
    """
    Signal que se dispara cuando se crea o actualiza un Pedido
    """
    if created:
        notify_new_pedido(instance)
    else:
        try:
            old_instance = Pedido.objects.get(id=instance.id)
            if old_instance.status != instance.status:
                notify_status_change(instance)
        except Pedido.DoesNotExist:
            pass


def notify_new_pedido(pedido):
    """Notifica la creación de un nuevo pedido"""
    # if pedido.cliente and pedido.cliente.email:
    #     send_mail(
    #         subject=f'Nuevo pedido #{pedido.id} creado',
    #         message=f'Su pedido ha sido creado exitosamente.',
    #         from_email='noreply@tuempresa.com',
    #         recipient_list=[pedido.cliente.email],
    #     )

    # if hasattr(pedido, 'hoja_de_ruta') and pedido.hoja_de_ruta and pedido.hoja_de_ruta.conductor:
    #     conductor = pedido.hoja_de_ruta.conductor
    #     if conductor.email:
    #         send_mail(
    #             subject=f'Nuevo pedido #{pedido.id} asignado',
    #             message=f'Se le ha asignado un nuevo pedido.',
    #             from_email='noreply@tuempresa.com',
    #             recipient_list=[conductor.email],
    #         )


def notify_status_change(pedido):
    """Notifica cambios en el estado del pedido"""
    # Mensaje base según el estado
    mensajes_estado = {
        'CREADO': 'Su pedido ha sido creado',
        'EN_RUTA': 'Su pedido está en camino',
        'ENTREGADO': 'Su pedido ha sido entregado exitosamente',
        'CANCELADO': 'Su pedido ha sido cancelado'
    }

    mensaje_base = mensajes_estado.get(pedido.status, 'Estado actualizado')

    # Notificar al cliente
    if pedido.cliente and pedido.cliente.email:
        send_mail(
            subject=f'Actualización de pedido #{pedido.id}',
            message=f'{mensaje_base}. Número de seguimiento: {pedido.id}',
            from_email='noreply@tuempresa.com',
            recipient_list=[pedido.cliente.email],
        )

    # Notificar al conductor
    if hasattr(pedido, 'hoja_de_ruta') and pedido.hoja_de_ruta and pedido.hoja_de_ruta.conductor:
        conductor = pedido.hoja_de_ruta.conductor
        if conductor.email:
            send_mail(
                subject=f'Actualización de pedido #{pedido.id}',
                message=f'El pedido ha cambiado al estado: {pedido.status}',
                from_email='noreply@tuempresa.com',
                recipient_list=[conductor.email],
            )