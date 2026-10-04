-- V10: Categoría Cigarros con productos por unidad y cajetilla
--      Fuente: CAJA VENTAS STOCK.csv (STOCK DE CIGARROS)

-- 1. Insertar categoría
INSERT INTO categorias (nombre, descripcion, activa)
VALUES ('Cigarros', 'Cigarros por unidad y cajetilla', true)
ON CONFLICT (nombre) DO NOTHING;

-- 2. Productos por UNIDAD (precio por cigarro individual)
--    stock_minimo = equivalente a 1 caja (x20 → 20 uds, x10 → 10 uds)
INSERT INTO productos (nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, activo, categoria_id)
SELECT nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, true,
       (SELECT id FROM categorias WHERE nombre = 'Cigarros')
FROM (VALUES
  ('Cigarro Golden Verde x20 (unidad)',    'Golden',   0.15, 0.50, 194, 20),
  ('Cigarro Hamilton Verde x20 (unidad)',  'Hamilton', 0.15, 0.50, 240, 20),
  ('Cigarro Golden Rojo x20 (unidad)',     'Golden',   0.15, 0.50, 120, 20),
  ('Cigarro Carnival x20 (unidad)',        'Carnival', 0.30, 0.80, 174, 20),
  ('Cigarro L&M Azul x20 (unidad)',        'L&M',      4.00, 10.00, 38,  5),
  ('Cigarro Pall Mall Mora x20 (unidad)',  'Pall Mall',0.60, 1.00, 195, 20),
  ('Cigarro Pall Mall Verde x20 (unidad)', 'Pall Mall',0.60, 1.00, 200, 20),
  ('Cigarro Pall Mall Azul x20 (unidad)',  'Pall Mall',0.59, 1.00, 108, 20),
  ('Cigarro Sunrise Mix x20 (unidad)',     'Sunrise',  NULL, 1.00,  38, 20),
  ('Cigarro Lucky Mora x20 (unidad)',      'Lucky',    0.89, 1.50, 164, 20),
  ('Cigarro Lucky Naranja x20 (unidad)',   'Lucky',    0.89, 1.50,  75, 20),
  ('Cigarro Lucky Azul x20 (unidad)',      'Lucky',    0.89, 1.50,  91, 20),
  ('Cigarro Lucky Fresa x10 (unidad)',     'Lucky',    1.00, 1.50,  70, 10),
  ('Cigarro Lucky Sandia x10 (unidad)',    'Lucky',    1.00, 1.50,  38, 10),
  ('Cigarro Marlboro Mora x10 (unidad)',   'Marlboro', 1.00, 1.20, 285, 10),
  ('Cigarro Marlboro Sandia x20 (unidad)', 'Marlboro', 0.89, 1.20, 243, 20),
  ('Cigarro Marlboro Canela x20 (unidad)', 'Marlboro', 0.89, 1.20, 177, 20),
  ('Cigarro Marlboro Rojo x20 (unidad)',   'Marlboro', 0.89, 1.20, 212, 20),
  ('Cigarro Kent Blue (unidad)',           'Kent',     NULL, 1.50,   8,  5),
  ('Cigarro Kent Fresh (unidad)',          'Kent',     NULL, 1.50,  21,  5)
) AS t(nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo);

-- 3. Productos por CAJETILLA (precio por caja/cajetilla completa)
--    stock_minimo = 2 cajetillas mínimo
INSERT INTO productos (nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, activo, categoria_id)
SELECT nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo, true,
       (SELECT id FROM categorias WHERE nombre = 'Cigarros')
FROM (VALUES
  ('Cigarro Golden Verde x20 (cajetilla)',    'Golden',    3.00,  6.00, 0, 2),
  ('Cigarro Hamilton Verde x20 (cajetilla)',  'Hamilton',  3.00, 10.00, 0, 2),
  ('Cigarro Golden Rojo x20 (cajetilla)',     'Golden',    3.00,  6.00, 0, 2),
  ('Cigarro Carnival x20 (cajetilla)',        'Carnival',  4.00, 10.00, 0, 2),
  ('Cigarro L&M Azul x20 (cajetilla)',        'L&M',       3.50, 14.00, 0, 2),
  ('Cigarro Pall Mall Mora x20 (cajetilla)',  'Pall Mall', 12.00, 16.00, 0, 2),
  ('Cigarro Pall Mall Verde x20 (cajetilla)', 'Pall Mall', 12.00, 16.00, 0, 2),
  ('Cigarro Pall Mall Azul x20 (cajetilla)',  'Pall Mall', 11.80, 16.00, 0, 2),
  ('Cigarro Sunrise Mix x20 (cajetilla)',     'Sunrise',   12.00, 16.00, 0, 2),
  ('Cigarro Lucky Mora x20 (cajetilla)',      'Lucky',     17.86, 24.00, 0, 2),
  ('Cigarro Lucky Naranja x20 (cajetilla)',   'Lucky',     17.86, 24.00, 0, 2),
  ('Cigarro Lucky Azul x20 (cajetilla)',      'Lucky',     17.86, 24.00, 0, 2),
  ('Cigarro Lucky Mora x10 (cajetilla)',      'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Fresa x10 (cajetilla)',     'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Sandia x10 (cajetilla)',    'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Naranja x10 (cajetilla)',   'Lucky',      9.96, 13.00, 0, 2),
  ('Cigarro Lucky Azul x10 (cajetilla)',      'Lucky',      9.96, 13.00, 4, 2),
  ('Cigarro Marlboro Mora x10 (cajetilla)',   'Marlboro',   9.96, 10.00, 0, 2),
  ('Cigarro Marlboro Sandia x20 (cajetilla)', 'Marlboro',  17.85, 20.00, 0, 2),
  ('Cigarro Marlboro Canela x20 (cajetilla)', 'Marlboro',  17.85, 20.00, 0, 2),
  ('Cigarro Marlboro Rojo x20 (cajetilla)',   'Marlboro',  17.85, 20.00, 0, 2)
) AS t(nombre, marca, precio_compra, precio_venta, stock_actual, stock_minimo);
