@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.licoreria.chilalo.ui.ventas

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import com.licoreria.chilalo.data.remote.ComprobanteDto
import com.licoreria.chilalo.data.remote.DetalleVentaDto
import com.licoreria.chilalo.data.remote.VentaDto

private val colorVerde = Color(0xFF1B5E20)
private val colorVerdeClaro = Color(0xFF2E7D32)
private val colorRojo = Color(0xFFB71C1C)
private val colorAzul = Color(0xFF1565C0)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VentasScreen(
    viewModel: VentasViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    val shouldLoadMore by remember {
        derivedStateOf {
            val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            lastVisible >= state.ventas.size - 3
        }
    }

    LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore) viewModel.loadNextPage()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ventas", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White
                ),
                actions = {
                    IconButton(onClick = { viewModel.load() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Actualizar")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Filtros de fecha
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(VentasFiltro.entries) { filtro ->
                    FilterChip(
                        selected = state.filtro == filtro,
                        onClick = { viewModel.setFiltro(filtro) },
                        label = { Text(filtro.label) }
                    )
                }
            }

            if (state.isLoading && state.ventas.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else if (state.error != null && state.ventas.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                        TextButton(onClick = { viewModel.load() }) { Text("Reintentar") }
                    }
                }
            } else if (state.ventas.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No hay ventas en este período", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                LazyColumn(
                    state = listState,
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(state.ventas, key = { it.id }) { venta ->
                        VentaCard(venta, onClick = { viewModel.onVentaClick(venta) })
                    }
                    if (state.isLoading) {
                        item {
                            Box(
                                Modifier.fillMaxWidth().padding(16.dp),
                                contentAlignment = Alignment.Center
                            ) { CircularProgressIndicator() }
                        }
                    }
                }
            }
        }
    }

    // Bottom sheet de detalle
    if (state.showDetalle) {
        ModalBottomSheet(
            onDismissRequest = viewModel::dismissDetalle,
            sheetState = sheetState
        ) {
            VentaDetalleSheet(
                state = state,
                onShowEmitirBoleta = viewModel::showEmitirBoleta,
                onShowEmitirFactura = viewModel::showEmitirFactura,
                onDismiss = viewModel::dismissDetalle
            )
        }
    }

    // Dialog emitir boleta
    if (state.showComprobanteDialog == ComprobanteDialogTipo.BOLETA) {
        EmitirBoletaDialog(
            tipoDoc = state.emitirTipoDoc,
            numDoc = state.emitirNumDoc,
            nombre = state.emitirNombre,
            isEmitiendo = state.isEmitiendo,
            error = state.emitirError,
            onTipoDocChange = viewModel::onEmitirTipoDocChange,
            onNumDocChange = viewModel::onEmitirNumDocChange,
            onNombreChange = viewModel::onEmitirNombreChange,
            onConfirmar = viewModel::emitirBoleta,
            onDismiss = viewModel::dismissComprobanteDialog
        )
    }

    // Dialog emitir factura
    if (state.showComprobanteDialog == ComprobanteDialogTipo.FACTURA) {
        EmitirFacturaDialog(
            ruc = state.emitirRuc,
            razonSocial = state.emitirRazonSocial,
            isEmitiendo = state.isEmitiendo,
            error = state.emitirError,
            onRucChange = viewModel::onEmitirRucChange,
            onRazonSocialChange = viewModel::onEmitirRazonSocialChange,
            onConfirmar = viewModel::emitirFactura,
            onDismiss = viewModel::dismissComprobanteDialog
        )
    }
}

// ─── VentaCard (clickeable) ────────────────────────────────────────────────────

@Composable
private fun VentaCard(venta: VentaDto, onClick: () -> Unit) {
    val estadoColor = when (venta.estado.uppercase()) {
        "COMPLETADA" -> colorVerdeClaro
        "ANULADA" -> colorRojo
        else -> colorAzul
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    Icons.Default.Receipt,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
                Column {
                    Text(
                        text = venta.numeroVenta,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = venta.formaPago,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    venta.cliente?.let {
                        Text(
                            text = it.nombre,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = "S/. %.2f".format(venta.total),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = venta.estado,
                    style = MaterialTheme.typography.labelSmall,
                    color = estadoColor,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

// ─── Detalle de venta (bottom sheet) ──────────────────────────────────────────

@Composable
private fun VentaDetalleSheet(
    state: VentasUiState,
    onShowEmitirBoleta: () -> Unit,
    onShowEmitirFactura: () -> Unit,
    onDismiss: () -> Unit
) {
    val venta = state.ventaSeleccionada ?: return

    LazyColumn(contentPadding = PaddingValues(bottom = 32.dp)) {
        // Encabezado
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(venta.numeroVenta, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    venta.fecha?.take(10)?.let {
                        Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
                val estadoColor = when (venta.estado.uppercase()) {
                    "COMPLETADA" -> colorVerdeClaro
                    "ANULADA" -> colorRojo
                    else -> colorAzul
                }
                Surface(shape = RoundedCornerShape(6.dp), color = estadoColor.copy(alpha = 0.1f)) {
                    Text(
                        venta.estado,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        color = estadoColor,
                        fontWeight = FontWeight.SemiBold,
                        style = MaterialTheme.typography.labelMedium
                    )
                }
            }
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
        }

        // Cliente
        venta.cliente?.let { cliente ->
            item {
                Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)) {
                    Text("Cliente", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(cliente.nombre, fontWeight = FontWeight.Medium, style = MaterialTheme.typography.bodyMedium)
                    Text(
                        "${cliente.tipoDocumento}: ${cliente.numeroDocumento}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Divider(modifier = Modifier.padding(horizontal = 16.dp))
            }
        }

        // Items del detalle
        item {
            Text(
                "Productos",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        if (state.isLoadingDetalle) {
            item {
                Box(modifier = Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                }
            }
        } else if (!venta.detalles.isNullOrEmpty()) {
            items(venta.detalles) { detalle ->
                DetalleItemRow(detalle)
            }
        } else {
            item {
                Text(
                    "Sin detalle disponible",
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }

        // Totales
        item {
            Divider(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp))
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                FilaTotal("Forma de pago", venta.formaPago, isText = true)
                FilaTotal("Subtotal", "S/ ${"%.2f".format(venta.subtotal)}")
                if (venta.descuento > 0) FilaTotal("Descuento", "- S/ ${"%.2f".format(venta.descuento)}", color = colorRojo)
                FilaTotal("IGV (18%)", "S/ ${"%.2f".format(venta.impuesto)}")
                Divider(modifier = Modifier.padding(vertical = 4.dp))
                FilaTotal("TOTAL", "S/ ${"%.2f".format(venta.total)}", bold = true, color = colorVerde)
                if (venta.vuelto > 0) FilaTotal("Vuelto", "S/ ${"%.2f".format(venta.vuelto)}", color = colorAzul)
            }
        }

        // Comprobante
        item {
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
                if (state.isLoadingComprobante) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Verificando comprobante...", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                } else if (state.comprobanteExistente != null) {
                    ComprobanteExistenteCard(state.comprobanteExistente)
                } else {
                    // Mensaje de éxito de emisión reciente
                    state.emitirSuccess?.let {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = colorVerdeClaro.copy(alpha = 0.1f),
                            modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp)
                        ) {
                            Text(
                                it,
                                modifier = Modifier.padding(12.dp),
                                color = colorVerdeClaro,
                                fontWeight = FontWeight.Medium,
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }

                    if (state.emitirSuccess == null) {
                        Text(
                            "Sin comprobante emitido",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(
                                onClick = onShowEmitirBoleta,
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Icon(Icons.Default.Description, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Boleta", fontSize = 13.sp)
                            }
                            OutlinedButton(
                                onClick = onShowEmitirFactura,
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Icon(Icons.Default.Description, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Factura", fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ComprobanteExistenteCard(comp: ComprobanteDto) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = colorAzul.copy(alpha = 0.08f),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Description, contentDescription = null, tint = colorAzul, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    comp.tipoComprobante,
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.bodyMedium,
                    color = colorAzul
                )
                Text(
                    "${comp.serie}-${comp.numero}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    "Estado SUNAT: ${comp.estadoSunat}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun DetalleItemRow(detalle: DetalleVentaDto) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            val nombre = detalle.producto?.nombre ?: detalle.packNombre ?: "—"
            Text(nombre, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
            Text(
                "S/ ${"%.2f".format(detalle.precioUnitario)} c/u · ${detalle.cantidad} ud.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Text(
            "S/ ${"%.2f".format(detalle.subtotal)}",
            fontWeight = FontWeight.SemiBold,
            style = MaterialTheme.typography.bodyMedium,
            color = colorVerde,
            textAlign = TextAlign.End
        )
    }
}

@Composable
private fun FilaTotal(
    label: String,
    value: String,
    bold: Boolean = false,
    color: Color = MaterialTheme.colorScheme.onSurface,
    isText: Boolean = false
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(
            value,
            fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal,
            color = if (isText) MaterialTheme.colorScheme.onSurface else color,
            style = if (bold) MaterialTheme.typography.titleMedium else MaterialTheme.typography.bodyMedium
        )
    }
}

// ─── Emitir Boleta Dialog ─────────────────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EmitirBoletaDialog(
    tipoDoc: String,
    numDoc: String,
    nombre: String,
    isEmitiendo: Boolean,
    error: String?,
    onTipoDocChange: (String) -> Unit,
    onNumDocChange: (String) -> Unit,
    onNombreChange: (String) -> Unit,
    onConfirmar: () -> Unit,
    onDismiss: () -> Unit
) {
    val tipoDocOptions = listOf("DNI", "CE")
    var expandedTipoDoc by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Emitir Boleta", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(14.dp))

                ExposedDropdownMenuBox(
                    expanded = expandedTipoDoc,
                    onExpandedChange = { expandedTipoDoc = it }
                ) {
                    OutlinedTextField(
                        value = tipoDoc,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Tipo documento") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expandedTipoDoc) },
                        modifier = Modifier.fillMaxWidth().menuAnchor(),
                        singleLine = true
                    )
                    ExposedDropdownMenu(expanded = expandedTipoDoc, onDismissRequest = { expandedTipoDoc = false }) {
                        tipoDocOptions.forEach { opt ->
                            DropdownMenuItem(text = { Text(opt) }, onClick = { onTipoDocChange(opt); expandedTipoDoc = false })
                        }
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = numDoc,
                    onValueChange = onNumDocChange,
                    label = { Text("Número de documento") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = nombre,
                    onValueChange = onNombreChange,
                    label = { Text("Nombre completo") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                error?.let {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(it, color = colorRojo, style = MaterialTheme.typography.bodySmall)
                }

                Spacer(modifier = Modifier.height(16.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancelar") }
                    Button(
                        onClick = onConfirmar,
                        enabled = !isEmitiendo,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        if (isEmitiendo) CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                        else Text("Emitir")
                    }
                }
            }
        }
    }
}

// ─── Emitir Factura Dialog ────────────────────────────────────────────────────

@Composable
private fun EmitirFacturaDialog(
    ruc: String,
    razonSocial: String,
    isEmitiendo: Boolean,
    error: String?,
    onRucChange: (String) -> Unit,
    onRazonSocialChange: (String) -> Unit,
    onConfirmar: () -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Emitir Factura", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = ruc,
                    onValueChange = onRucChange,
                    label = { Text("RUC (11 dígitos)") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = razonSocial,
                    onValueChange = onRazonSocialChange,
                    label = { Text("Razón social") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                error?.let {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(it, color = colorRojo, style = MaterialTheme.typography.bodySmall)
                }

                Spacer(modifier = Modifier.height(16.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancelar") }
                    Button(
                        onClick = onConfirmar,
                        enabled = !isEmitiendo,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        if (isEmitiendo) CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                        else Text("Emitir")
                    }
                }
            }
        }
    }
}
