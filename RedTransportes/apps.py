from django.apps import AppConfig


class RedtransportesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'RedTransportes'

    def ready(self):
        import RedTransportes.signals