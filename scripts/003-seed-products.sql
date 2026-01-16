-- Получаем ID категорий
WITH cats AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (name, description, price, image_url, category_id, in_stock, stock_quantity, brand) VALUES
  -- Удочки
  ('Shimano Alivio DX 3.6m', 'Универсальная телескопическая удочка для любительской рыбалки', 4500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'udochki'), true, 15, 'Shimano'),
  ('Daiwa Ninja X 4.2m', 'Легкая карбоновая удочка для фидерной ловли', 7200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'udochki'), true, 8, 'Daiwa'),
  ('Mikado Golden Lion 3.0m', 'Мощная удочка для ловли крупной рыбы', 5800, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'udochki'), true, 12, 'Mikado'),
  ('Salmo Sniper 2.7m', 'Компактная удочка для спиннинговой ловли', 3200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'udochki'), true, 20, 'Salmo'),
  ('Flagman Sherman Pro 4.0m', 'Профессиональная матчевая удочка', 12500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'udochki'), true, 5, 'Flagman'),

  -- Катушки
  ('Shimano Nasci 2500', 'Надежная безынерционная катушка для спиннинга', 8900, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'katushki'), true, 10, 'Shimano'),
  ('Daiwa Revros LT 3000', 'Легкая катушка с плавным ходом', 6500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'katushki'), true, 7, 'Daiwa'),
  ('Okuma Ceymar C-30', 'Бюджетная катушка для начинающих', 2800, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'katushki'), true, 25, 'Okuma'),
  ('Penn Conflict II 4000', 'Мощная катушка для морской рыбалки', 15200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'katushki'), true, 4, 'Penn'),
  ('Abu Garcia Revo SX', 'Премиальная мультипликаторная катушка', 18500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'katushki'), false, 0, 'Abu Garcia'),

  -- Приманки
  ('Набор воблеров Rapala 10шт', 'Классические воблеры разных размеров и цветов', 3500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'primanki'), true, 30, 'Rapala'),
  ('Силиконовые приманки Keitech 20шт', 'Мягкие приманки для джиговой ловли', 1200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'primanki'), true, 50, 'Keitech'),
  ('Блесна вертушка Mepps Aglia №3', 'Легендарная вращающаяся блесна', 450, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'primanki'), true, 100, 'Mepps'),
  ('Попперы Lucky Craft 5шт', 'Поверхностные приманки для ловли хищника', 2800, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'primanki'), true, 15, 'Lucky Craft'),
  ('Джиг-головки Owner 10шт', 'Качественные джиг-головки разного веса', 890, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'primanki'), true, 80, 'Owner'),

  -- Снасти
  ('Леска Sunline Super FC 150m', 'Флюорокарбоновая леска высокого качества', 1800, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'snasti'), true, 40, 'Sunline'),
  ('Плетеный шнур Power Pro 135m', 'Прочный плетеный шнур для спиннинга', 2200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'snasti'), true, 35, 'Power Pro'),
  ('Крючки Gamakatsu 50шт', 'Острые японские крючки разных размеров', 650, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'snasti'), true, 60, 'Gamakatsu'),
  ('Поплавки Colmic набор', 'Набор матчевых поплавков', 1100, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'snasti'), true, 25, 'Colmic'),
  ('Грузила набор 100г', 'Набор грузил разного веса', 350, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'snasti'), true, 90, 'Generic'),

  -- Одежда
  ('Куртка рыбака Norfin Discovery', 'Теплая непромокаемая куртка', 8500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'odezhda'), true, 12, 'Norfin'),
  ('Забродный костюм Simms G3', 'Профессиональный забродный костюм', 45000, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'odezhda'), true, 3, 'Simms'),
  ('Шапка флисовая', 'Теплая шапка для зимней рыбалки', 650, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'odezhda'), true, 50, 'Generic'),
  ('Перчатки рыболовные', 'Перчатки с открытыми пальцами', 890, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'odezhda'), true, 35, 'Generic'),
  ('Жилет разгрузочный', 'Многофункциональный жилет с карманами', 3200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'odezhda'), true, 18, 'Generic'),

  -- Аксессуары
  ('Ящик рыболовный Plano', 'Большой ящик с множеством отделений', 4500, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'aksessuary'), true, 10, 'Plano'),
  ('Сумка для удочек 150см', 'Чехол для транспортировки удочек', 1800, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'aksessuary'), true, 20, 'Generic'),
  ('Подсак телескопический', 'Складной подсак с большой головой', 2200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'aksessuary'), true, 15, 'Generic'),
  ('Весы электронные до 50кг', 'Точные весы для взвешивания улова', 1200, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'aksessuary'), true, 25, 'Generic'),
  ('Кресло рыболовное складное', 'Комфортное кресло с подлокотниками', 3800, '/placeholder.svg?height=300&width=300', (SELECT id FROM cats WHERE slug = 'aksessuary'), true, 8, 'Generic')
ON CONFLICT DO NOTHING;
