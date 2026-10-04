-- Eliminación robusta de CUALQUIER check constraint sobre la columna tipo en promociones
-- (por si el nombre generado por PostgreSQL fue distinto al esperado en V6)

DO $$
DECLARE
    v_constraint TEXT;
BEGIN
    FOR v_constraint IN
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON t.oid = c.conrelid
        JOIN pg_attribute a ON a.attrelid = t.oid
            AND a.attnum = ANY(c.conkey)
        WHERE t.relname  = 'promociones'
          AND a.attname  = 'tipo'
          AND c.contype  = 'c'   -- 'c' = check constraint
    LOOP
        EXECUTE 'ALTER TABLE promociones DROP CONSTRAINT ' || quote_ident(v_constraint);
    END LOOP;
END;
$$;

ALTER TABLE promociones ADD CONSTRAINT promociones_tipo_check
    CHECK (tipo IN ('DESCUENTO_PORCENTAJE', 'DESCUENTO_MONTO', 'CANTIDAD', 'CATEGORIA', 'VOLUMEN'));
