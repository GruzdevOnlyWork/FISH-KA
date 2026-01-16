-- Добавляем категории
INSERT INTO categories (name, slug, icon) VALUES
  ('Удочки и спиннинги', 'rods', 'fishing-rod'),
  ('Катушки', 'reels', 'settings'),
  ('Приманки', 'lures', 'target'),
  ('Снасти', 'tackle', 'anchor'),
  ('Одежда и обувь', 'clothing', 'shirt'),
  ('Аксессуары', 'accessories', 'briefcase');

-- Добавляем товары
INSERT INTO products (name, description, price, category_id, in_stock, stock_quantity, brand, image_url) VALUES
  -- Удочки
  ('Спиннинг Shimano Catana', 'Универсальный спиннинг для начинающих, длина 2.4м, тест 10-30г', 4500, (SELECT id FROM categories WHERE slug = 'rods'), true, 15, 'Shimano', '/placeholder.svg?height=300&width=300'),
  ('Удочка Daiwa Ninja', 'Телескопическая удочка 5м для поплавочной ловли', 3200, (SELECT id FROM categories WHERE slug = 'rods'), true, 8, 'Daiwa', '/placeholder.svg?height=300&width=300'),
  ('Фидер Salmo Diamond', 'Фидерное удилище 3.6м, тест до 120г', 6800, (SELECT id FROM categories WHERE slug = 'rods'), true, 5, 'Salmo', '/placeholder.svg?height=300&width=300'),
  ('Спиннинг Favorite Blue Bird', 'Лёгкий спиннинг для ультралайта, 1.98м', 5500, (SELECT id FROM categories WHERE slug = 'rods'), true, 12, 'Favorite', '/placeholder.svg?height=300&width=300'),
  
  -- Катушки
  ('Катушка Shimano Sahara', 'Безынерционная катушка 2500 размер, 5 подшипников', 5200, (SELECT id FROM categories WHERE slug = 'reels'), true, 20, 'Shimano', '/placeholder.svg?height=300&width=300'),
  ('Катушка Daiwa Revros', 'Надёжная катушка для спиннинга, размер 3000', 4100, (SELECT id FROM categories WHERE slug = 'reels'), true, 18, 'Daiwa', '/placeholder.svg?height=300&width=300'),
  ('Мультипликатор Abu Garcia', 'Мультипликаторная катушка для тяжёлого джига', 8900, (SELECT id FROM categories WHERE slug = 'reels'), true, 6, 'Abu Garcia', '/placeholder.svg?height=300&width=300'),
  ('Катушка Ryobi Zauber', 'Качественная катушка с байтраннером', 3800, (SELECT id FROM categories WHERE slug = 'reels'), false, 0, 'Ryobi', '/placeholder.svg?height=300&width=300'),
  
  -- Приманки
  ('Воблер Rapala Original', 'Классический воблер для щуки, 9см', 650, (SELECT id FROM categories WHERE slug = 'lures'), true, 50, 'Rapala', '/placeholder.svg?height=300&width=300'),
  ('Набор силиконовых приманок', 'Виброхвосты и твистеры, 30 шт в наборе', 890, (SELECT id FROM categories WHERE slug = 'lures'), true, 35, 'Keitech', '/placeholder.svg?height=300&width=300'),
  ('Блёсны колеблющиеся', 'Набор колебалок для щуки, 5 шт', 720, (SELECT id FROM categories WHERE slug = 'lures'), true, 40, 'Mepps', '/placeholder.svg?height=300&width=300'),
  ('Попперы для жереха', 'Поверхностные приманки, 3 шт', 580, (SELECT id FROM categories WHERE slug = 'lures'), true, 25, 'Lucky John', '/placeholder.svg?height=300&width=300'),
  
  -- Снасти
  ('Леска плетёная PowerPro', 'PE шнур 0.15мм, 150м, нагрузка 9кг', 1200, (SELECT id FROM categories WHERE slug = 'tackle'), true, 60, 'PowerPro', '/placeholder.svg?height=300&width=300'),
  ('Крючки Owner', 'Офсетные крючки для джига, 10 шт', 320, (SELECT id FROM categories WHERE slug = 'tackle'), true, 100, 'Owner', '/placeholder.svg?height=300&width=300'),
  ('Поводки стальные', 'Набор поводков разной длины, 10 шт', 280, (SELECT id FROM categories WHERE slug = 'tackle'), true, 80, 'Kosadaka', '/placeholder.svg?height=300&width=300'),
  ('Грузила джиговые', 'Чебурашки 10-30г, набор 15 шт', 450, (SELECT id FROM categories WHERE slug = 'tackle'), true, 45, 'Fanatik', '/placeholder.svg?height=300&width=300'),
  
  -- Одежда
  ('Куртка рыболовная', 'Непромокаемая куртка с капюшоном, размеры M-XXL', 4500, (SELECT id FROM categories WHERE slug = 'clothing'), true, 12, 'Norfin', '/placeholder.svg?height=300&width=300'),
  ('Сапоги забродные', 'Вейдерсы из ПВХ, размеры 41-46', 3800, (SELECT id FROM categories WHERE slug = 'clothing'), true, 8, 'Nordman', '/placeholder.svg?height=300&width=300'),
  ('Перчатки рыболовные', 'Неопреновые перчатки без пальцев', 650, (SELECT id FROM categories WHERE slug = 'clothing'), true, 30, 'Rapala', '/placeholder.svg?height=300&width=300'),
  ('Кепка с фонариком', 'Бейсболка со встроенным LED фонарём', 890, (SELECT id FROM categories WHERE slug = 'clothing'), true, 25, 'Carp Zoom', '/placeholder.svg?height=300&width=300'),
  
  -- Аксессуары
  ('Ящик рыболовный', 'Многосекционный ящик для снастей', 2200, (SELECT id FROM categories WHERE slug = 'accessories'), true, 15, 'Plano', '/placeholder.svg?height=300&width=300'),
  ('Подсачек складной', 'Подсак с телескопической ручкой 2м', 1800, (SELECT id FROM categories WHERE slug = 'accessories'), true, 10, 'Flagman', '/placeholder.svg?height=300&width=300'),
  ('Эхолот Deeper', 'Портативный беспроводной эхолот', 12500, (SELECT id FROM categories WHERE slug = 'accessories'), true, 5, 'Deeper', '/placeholder.svg?height=300&width=300'),
  ('Кукан металлический', 'Кукан на 5 застёжек', 450, (SELECT id FROM categories WHERE slug = 'accessories'), true, 40, 'Kosadaka', '/placeholder.svg?height=300&width=300');
