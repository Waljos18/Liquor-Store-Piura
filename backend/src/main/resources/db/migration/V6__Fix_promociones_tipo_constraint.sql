-- Fix tipo CHECK constraint in promociones to match Java enum TipoPromocion values
-- Old constraint: 'PORCENTAJE', 'MONTO_FIJO', 'CANTIDAD', 'CATEGORIA'
-- New constraint:  'DESCUENTO_PORCENTAJE', 'DESCUENTO_MONTO', 'CANTIDAD', 'CATEGORIA', 'VOLUMEN'

-- Update any existing rows with old values
UPDATE promociones SET tipo = 'DESCUENTO_PORCENTAJE' WHERE tipo = 'PORCENTAJE';
UPDATE promociones SET tipo = 'DESCUENTO_MONTO'      WHERE tipo = 'MONTO_FIJO';

-- Drop old constraint and add corrected one
ALTER TABLE promociones DROP CONSTRAINT IF EXISTS promociones_tipo_check;
ALTER TABLE promociones ADD CONSTRAINT promociones_tipo_check
    CHECK (tipo IN ('DESCUENTO_PORCENTAJE', 'DESCUENTO_MONTO', 'CANTIDAD', 'CATEGORIA', 'VOLUMEN'));
