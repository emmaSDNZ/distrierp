# Generated by Django 5.1.7 on 2025-04-25 02:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0026_supplierproduct'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supplierproduct',
            old_name='product',
            new_name='product_id',
        ),
        migrations.RenameField(
            model_name='supplierproduct',
            old_name='supplier',
            new_name='supplier_id',
        ),
    ]
