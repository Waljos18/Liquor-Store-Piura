package com.licoreria.dto.inventario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Stock en unidades y equivalencia en packs disponibles (según ESPECIFICACION_INVENTARIO_PACKS).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockEquivalenciaPacksDTO {

    private Long productoId;
    private String productoNombre;
    /** Stock siempre en unidades */
    private Integer stockUnidades;
    private Integer stockMinimo;
    /** Packs que incluyen este producto y cuántos packs completos se pueden armar */
    private List<EquivalenciaPack> packsDisponibles;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquivalenciaPack {
        private Long packId;
        private String packNombre;
        private Integer unidadesPorPack;
        /** Cantidad de packs completos = stockUnidades / unidadesPorPack */
        private Integer packsCompletos;
    }
}
