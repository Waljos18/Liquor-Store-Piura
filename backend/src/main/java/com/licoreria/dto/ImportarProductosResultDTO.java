package com.licoreria.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportarProductosResultDTO {

    private int totalProcesados;
    private int creados;
    private int omitidos;
    private int errores;
    @Builder.Default
    private List<String> mensajesError = new ArrayList<>();
    @Builder.Default
    private List<String> productosCreados = new ArrayList<>();
}
