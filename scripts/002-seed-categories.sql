-- Вставляем стандартные категории рыболовных товаров
INSERT INTO categories (name, slug, icon) VALUES
  ('Удочки', 'udochki', 'fishing-rod'),
  ('Катушки', 'katushki', 'reel'),
  ('Приманки', 'primanki', 'lure'),
  ('Снасти', 'snasti', 'tackle'),
  ('Одежда', 'odezhda', 'shirt'),
  ('Аксессуары', 'aksessuary', 'backpack')
ON CONFLICT (slug) DO NOTHING;
