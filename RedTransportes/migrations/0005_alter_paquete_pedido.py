# Generated by Django 5.1.1 on 2024-09-26 19:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RedTransportes', '0004_conductor_apellido'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paquete',
            name='pedido',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='paquetes', to='RedTransportes.pedido'),
            preserve_default=False,
        ),
    ]
