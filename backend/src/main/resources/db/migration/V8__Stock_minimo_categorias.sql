-- V8: Asignar stock mínimo por categoría (nombres con coincidencia flexible)
UPDATE productos p
SET stock_minimo = CASE
    WHEN c.nombre ILIKE '%vino%'                              THEN 2
    WHEN c.nombre ILIKE '%pisco%'                             THEN 2
    WHEN c.nombre ILIKE '%champagne%'
      OR c.nombre ILIKE '%espumante%'                         THEN 1
    WHEN c.nombre ILIKE '%tequila%'                           THEN 1
    WHEN c.nombre ILIKE '%whisky%'
      OR c.nombre ILIKE '%whiski%'
      OR c.nombre ILIKE '%whisk%'                             THEN 1
    WHEN c.nombre ILIKE '%ron%'                               THEN 2
    WHEN c.nombre ILIKE '%vodka%'                             THEN 1
    WHEN c.nombre ILIKE '%agua%'                              THEN 5
    WHEN c.nombre ILIKE '%piqueo%'
      OR c.nombre ILIKE '%snack%'                             THEN 3
    WHEN c.nombre ILIKE '%otro%'                              THEN 4
    ELSE p.stock_minimo
END
FROM categorias c
WHERE p.categoria_id = c.id;
