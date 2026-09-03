from decimal import Decimal

from django.core.management.base import BaseCommand

from store.models import Category, Product


CATALOG = {
    'electronics': {
        'name': 'Electronics',
        'products': [
            ('Wireless Bluetooth Speaker', 'Portable stereo speaker with rich sound and all-day battery life.', '1499.00', ''),
            ('Smart Fitness Watch', 'Track steps, activity and daily wellness from your wrist.', '2499.00', ''),
            ('LED Study Lamp', 'Adjustable desk lamp with focused, eye-friendly light.', '899.00', 'products/Gluehlampe_01_KMJ.png'),
            ('Wireless Earbuds', 'Comfortable true-wireless earbuds with a compact charging case.', '1799.00', ''),
            ('Fast Charging Power Bank', '10000 mAh portable charging for life on the move.', '1299.00', ''),
        ],
    },
    'home-kitchen': {
        'name': 'Home & Kitchen',
        'products': [
            ('Premium Olive Oil', 'Cold-pressed olive oil for everyday cooking and dressings.', '650.00', 'products/Containers-olive-oil.webp'),
            ('Ceramic Coffee Mug Set', 'A set of two comfortable ceramic mugs for your morning ritual.', '499.00', ''),
            ('Bamboo Storage Basket', 'Natural woven storage for shelves, desks and bedside tables.', '699.00', ''),
            ('Non-Stick Fry Pan', 'Reliable everyday cookware with an easy-clean surface.', '1199.00', ''),
            ('Cotton Kitchen Towels', 'Soft, absorbent towels in a set of four.', '349.00', ''),
        ],
    },
    'furniture': {
        'name': 'Furniture',
        'products': [
            ('Wooden Dining Table Set', 'A warm, durable dining set designed for shared meals.', '12500.00', 'products/wooden-dining-table-set-isolated-free-photo.jpg'),
            ('Classic Wooden Chair', 'A timeless solid-wood chair for dining or work.', '2800.00', 'products/stock-photo-wooden-chair-over-white-with-clipping-path.jpg'),
            ('Minimalist Side Table', 'Compact side table with clean lines for modern rooms.', '2200.00', ''),
            ('Fabric Lounge Cushion', 'Soft support and a calm color accent for your space.', '799.00', ''),
        ],
    },
    'beauty': {
        'name': 'Beauty & Personal Care',
        'products': [
            ('Everyday Eau de Parfum', 'A light, warm fragrance for day-to-evening wear.', '1599.00', 'products/images.jpg'),
            ('Hydrating Face Cleanser', 'Gentle daily cleansing for fresh, comfortable skin.', '499.00', ''),
            ('Nourishing Body Lotion', 'Fast-absorbing moisture with a soft floral scent.', '549.00', ''),
            ('Travel Grooming Kit', 'Essential personal-care items in a neat zip pouch.', '899.00', ''),
        ],
    },
    'grocery': {
        'name': 'Grocery',
        'products': [
            ('Coconut Biscuits', 'Crisp, lightly sweet biscuits for tea time.', '80.00', 'products/61WkiYtfpIL.jpg'),
            ('Organic Green Tea', 'A fragrant everyday tea with a clean finish.', '299.00', ''),
            ('Roasted Almonds', 'Lightly salted premium almonds for easy snacking.', '450.00', ''),
            ('Wildflower Honey', 'Pure honey with a naturally rich golden taste.', '399.00', ''),
        ],
    },
    'accessories': {
        'name': 'Accessories',
        'products': [
            ('Everyday Canvas Backpack', 'A spacious, dependable backpack for work and weekends.', '1399.00', ''),
            ('Stainless Steel Water Bottle', 'Insulated bottle that keeps drinks at the right temperature.', '699.00', ''),
            ('Classic Sunglasses', 'Comfortable UV-protection sunglasses with a clean silhouette.', '999.00', ''),
            ('Desk Organizer Set', 'Keep pens, notes and daily essentials within reach.', '599.00', ''),
        ],
    },
}

FALLBACK_IMAGES = {
    'electronics': 'products/Gluehlampe_01_KMJ.png',
    'home-kitchen': 'products/Containers-olive-oil.webp',
    'furniture': 'products/wooden-dining-table-set-isolated-free-photo.jpg',
    'beauty': 'products/images.jpg',
    'grocery': 'products/61WkiYtfpIL.jpg',
    'accessories': 'products/shopping.webp',
}


class Command(BaseCommand):
    help = 'Create a starter Velora catalog without duplicating existing products.'

    def handle(self, *args, **options):
        created = 0
        existing = 0

        for slug, category_data in CATALOG.items():
            category, _ = Category.objects.get_or_create(
                slug=slug,
                defaults={'name': category_data['name']},
            )
            for name, description, price, image in category_data['products']:
                product, was_created = Product.objects.get_or_create(
                    category=category,
                    name=name,
                    defaults={
                        'description': description,
                        'price': Decimal(price),
                        'image': image or None,
                    },
                )
                if was_created:
                    created += 1
                else:
                    existing += 1
                if not product.image:
                    product.image = image or FALLBACK_IMAGES[slug]
                    product.save(update_fields=['image'])

        self.stdout.write(self.style.SUCCESS(f'Catalog ready: {created} products created, {existing} already existed.'))
