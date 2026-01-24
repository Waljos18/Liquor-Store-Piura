-- Datos iniciales: categorías. Usuarios admin/vendedor se crean vía DataInitializer (BCrypt).

INSERT INTO categorias (nombre, descripcion) VALUES
('Cervezas', 'Cervezas nacionales e importadas'),
('Vinos', 'Vinos tintos, blancos y espumantes'),
('Licores', 'Licores diversos'),
('Whiskies', 'Whiskies nacionales e importados'),
('Ron', 'Ron nacional e importado'),
('Pisco', 'Pisco peruano'),
('Vodka', 'Vodka nacional e importado'),
('Snacks', 'Snacks y aperitivos')
ON CONFLICT (nombre) DO NOTHING;
