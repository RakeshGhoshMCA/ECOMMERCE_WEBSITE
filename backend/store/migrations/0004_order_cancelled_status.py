from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('store', '0003_order_status')]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(
                choices=[('PROCESSING', 'Processing'), ('SHIPPED', 'Shipped'), ('DELIVERED', 'Delivered'), ('CANCELLED', 'Cancelled')],
                default='PROCESSING',
                max_length=20,
            ),
        ),
    ]
