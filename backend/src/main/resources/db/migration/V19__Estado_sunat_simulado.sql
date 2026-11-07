-- Nuevo estado SIMULADO: el comprobante pasó por el envío de prueba,
-- pero NO fue enviado ni aceptado realmente por SUNAT.
ALTER TABLE comprobantes_electronicos
    DROP CONSTRAINT IF EXISTS comprobantes_electronicos_estado_sunat_check;

ALTER TABLE comprobantes_electronicos
    ADD CONSTRAINT comprobantes_electronicos_estado_sunat_check
    CHECK (estado_sunat IN ('PENDIENTE', 'SIMULADO', 'ACEPTADO', 'RECHAZADO', 'ERROR'));

-- Hasta ahora no existió integración real con SUNAT: todo ACEPTADO fue simulado.
UPDATE comprobantes_electronicos SET estado_sunat = 'SIMULADO' WHERE estado_sunat = 'ACEPTADO';
