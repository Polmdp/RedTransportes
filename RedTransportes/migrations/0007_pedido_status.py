# Generated by Django 5.1.1 on 2024-11-04 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RedTransportes', '0006_ruta_localidades_intermedias_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pedido',
            name='status',
            field=models.CharField(choices=[('CREADO', 'Creado'), ('EN_RUTA', 'En Ruta'), ('ENTREGADO', 'Entregado'), ('CANCELADO', 'Cancelado')], default='CREADO', max_length=20),
        ),
    ]
