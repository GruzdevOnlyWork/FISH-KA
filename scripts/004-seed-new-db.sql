-- Удаляем старые данные если есть
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM categories;

-- Добавляем поле description если его нет
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

-- Добавляем категории с описаниями
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Удочки', 'rods', '🎣', 'Спиннинги, фидеры, поплавочные и зимние удочки'),
  ('Катушки', 'reels', '🔄', 'Безынерционные, мультипликаторные и инерционные катушки'),
  ('Приманки', 'lures', '🪱', 'Воблеры, блёсны, силиконовые приманки, джиг-головки'),
  ('Снасти', 'tackle', '🎯', 'Лески, шнуры, крючки, поплавки, грузила'),
  ('Одежда', 'clothing', '🧥', 'Костюмы, вейдерсы, жилеты, перчатки, головные уборы'),
  ('Аксессуары', 'accessories', '🎒', 'Ящики, подсачеки, эхолоты, кресла, весы');

-- Удочки
INSERT INTO products (name, description, price, image_url, category_id, in_stock, stock_quantity, brand) VALUES
  ('Спиннинг Shimano Catana', 'Легкий и прочный спиннинг для начинающих', 4500.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'rods'), true, 15, 'Shimano'),
  ('Фидер Daiwa Black Widow', 'Профессиональный фидер для дальнего заброса', 8900.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'rods'), true, 8, 'Daiwa'),
  ('Удочка поплавочная Mikado', 'Классическая поплавочная удочка 5м', 2200.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'rods'), true, 20, 'Mikado'),
  ('Спиннинг Major Craft Solpara', 'Японский спиннинг для морской рыбалки', 12500.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'rods'), true, 5, 'Major Craft'),
  ('Удочка зимняя Salmo', 'Компактная зимняя удочка', 890.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'rods'), true, 30, 'Salmo'),

-- Катушки
  ('Катушка Shimano Sedona', 'Надежная безынерционная катушка', 5600.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'reels'), true, 12, 'Shimano'),
  ('Катушка Daiwa Ninja', 'Легкая катушка для спиннинга', 4200.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'reels'), true, 18, 'Daiwa'),
  ('Мультипликатор Abu Garcia', 'Мощная мультипликаторная катушка', 9800.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'reels'), true, 6, 'Abu Garcia'),
  ('Катушка Penn Battle', 'Морская силовая катушка', 11500.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'reels'), false, 0, 'Penn'),
  ('Катушка Ryobi Zauber', 'Бюджетная качественная катушка', 2800.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'reels'), true, 25, 'Ryobi'),

-- Приманки
  ('Воблер Rapala Original', 'Классический воблер для щуки', 650.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'lures'), true, 50, 'Rapala'),
  ('Силиконовые приманки Keitech', 'Набор виброхвостов 10шт', 890.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'lures'), true, 40, 'Keitech'),
  ('Блесна Mepps Aglia', 'Вращающаяся блесна №3', 380.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'lures'), true, 60, 'Mepps'),
  ('Джиг-головки Owner', 'Набор джиг-головок 5-15г', 450.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'lures'), true, 35, 'Owner'),
  ('Поппер Yo-Zuri', 'Поверхностная приманка для окуня', 720.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'lures'), true, 28, 'Yo-Zuri'),

-- Снасти
  ('Леска Sunline Siglon', 'Монофильная леска 0.25мм 150м', 450.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'tackle'), true, 80, 'Sunline'),
  ('Плетенка Power Pro', 'Плетеный шнур 0.15мм 135м', 1800.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'tackle'), true, 45, 'Power Pro'),
  ('Крючки Gamakatsu', 'Набор крючков разных размеров', 320.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'tackle'), true, 100, 'Gamakatsu'),
  ('Поплавки Cralusso', 'Набор матчевых поплавков', 580.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'tackle'), true, 55, 'Cralusso'),
  ('Грузила набор', 'Ассорти грузил 50-200г', 290.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'tackle'), true, 70, 'NoName'),

-- Одежда
  ('Костюм Norfin Discovery', 'Зимний рыболовный костюм', 15800.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'clothing'), true, 10, 'Norfin'),
  ('Вейдерсы Simms G3', 'Профессиональные забродные сапоги', 28500.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'clothing'), true, 4, 'Simms'),
  ('Жилет рыболовный', 'Жилет с карманами для снастей', 3200.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'clothing'), true, 15, 'Rapala'),
  ('Перчатки неопреновые', 'Теплые перчатки для зимней рыбалки', 1200.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'clothing'), true, 25, 'Norfin'),
  ('Кепка с фонариком', 'Кепка со встроенным LED фонарем', 890.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'clothing'), true, 30, 'NoName'),

-- Аксессуары
  ('Ящик рыболовный Plano', 'Большой ящик для снастей', 4500.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'accessories'), true, 12, 'Plano'),
  ('Подсачек телескопический', 'Складной подсачек 2м', 1800.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'accessories'), true, 20, 'Mikado'),
  ('Эхолот Deeper Pro', 'Беспроводной эхолот для смартфона', 18900.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'accessories'), true, 8, 'Deeper'),
  ('Кресло рыболовное', 'Складное кресло с подлокотниками', 3500.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'accessories'), true, 15, 'NoName'),
  ('Весы электронные', 'Весы для взвешивания улова до 50кг', 1200.00, '/placeholder.svg?height=300&width=300', (SELECT id FROM categories WHERE slug = 'accessories'), true, 22, 'Rapala');
