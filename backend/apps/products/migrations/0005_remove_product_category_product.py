# Generated by Django 5.1.7 on 2025-04-08 20:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_product'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='category_product',
        ),
    ]
