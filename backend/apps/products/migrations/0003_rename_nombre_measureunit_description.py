# Generated by Django 5.1.7 on 2025-04-08 18:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_rename_description_measureunit_nombre'),
    ]

    operations = [
        migrations.RenameField(
            model_name='measureunit',
            old_name='nombre',
            new_name='description',
        ),
    ]
