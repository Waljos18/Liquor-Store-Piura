ALTER TABLE compras
    ALTER COLUMN fecha TYPE DATE
    USING fecha::date;