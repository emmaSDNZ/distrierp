# Generated by Django 5.1.7 on 2025-04-10 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0013_rename_category_product_categories'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, verbose_name='Precio'),
        ),
        migrations.AlterField(
            model_name='product',
            name='price_cost',
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, verbose_name='Precio de Costo'),
        ),
        migrations.AlterField(
            model_name='product',
            name='price_sale',
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, verbose_name='Precio de Venta'),
        ),
    ]
