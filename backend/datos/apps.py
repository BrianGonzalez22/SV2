from django.apps import AppConfig


class DatosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'datos'

def ready(self):
    import datos.signals
