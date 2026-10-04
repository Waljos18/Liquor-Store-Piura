@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.licoreria.chilalo.ui.pos

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import com.licoreria.chilalo.data.remote.ClienteDto
import com.licoreria.chilalo.data.remote.ComprobanteEmitidoDto
import com.licoreria.chilalo.data.remote.PackDto
import com.licoreria.chilalo.data.remote.ProductoDto
import com.licoreria.chilalo.data.remote.PromocionDto
import com.licoreria.chilalo.ui.scanner.BarcodeScannerScreen
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.abs

private val colorVerde = Color(0xFF1B5E20)
private val colorVerdeClaro = Color(0xFF2E7D32)
private val colorRojo = Color(0xFFB71C1C)
private val colorNaranja = Color(0xFFE65100)
private val colorAzul = Color(0xFF1565C0)
private val colorMorado = Color(0xFF6A1B9A)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun POSScreen(
    viewModel: POSViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val cartSheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    LaunchedEffect(state.error) {
        state.error?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.dismissError()
        }
    }

    LaunchedEffect(state.scannerMessage) {
        state.scannerMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearScannerMessage()
        }
    }

    if (state.showScanner) {
        BarcodeScannerScreen(
            title = "Escanear producto",
            onBarcodeDetected = { codigo -> viewModel.onBarcodeScanned(codigo) },
            onClose = { viewModel.closeScanner() }
        )
        return
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Punto de Venta", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colorVerde,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White
                ),
                actions = {
                    // Botón promociones activas
                    if (state.promociones.isNotEmpty()) {
                        BadgedBox(
                            badge = {
                                Badge { Text("${state.promociones.size}") }
                            }
                        ) {
                            IconButton(onClick = { viewModel.togglePromociones() }) {
                                Icon(Icons.Default.LocalOffer, contentDescription = "Promociones")
                            }
                        }
                    }
                    BadgedBox(
                        badge = {
                            if (state.cartItemCount > 0) {
                                Badge { Text("${state.cartItemCount}") }
                            }
                        }
                    ) {
                        IconButton(onClick = { viewModel.toggleCart() }) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = "Carrito")
                        }
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {

                // Barra de búsqueda + scanner
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = state.searchQuery,
                        onValueChange = viewModel::onSearchChange,
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Buscar producto o pack...") },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                        trailingIcon = {
                            if (state.searchQuery.isNotEmpty()) {
                                IconButton(onClick = { viewModel.onSearchChange("") }) {
                                    Icon(Icons.Default.Close, contentDescription = "Limpiar")
                                }
                            }
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    IconButton(
                        onClick = { viewModel.openScanner() },
                        modifier = Modifier
                            .size(52.dp)
                            .background(colorVerde, RoundedCornerShape(12.dp))
                    ) {
                        Icon(Icons.Default.QrCodeScanner, contentDescription = "Escanear código", tint = Color.White)
                    }
                }

                // Panel de promociones activas (colapsable)
                if (state.promociones.isNotEmpty()) {
                    PromocionesPanel(
                        promociones = state.promociones,
                        expanded = state.showPromociones,
                        onToggle = viewModel::togglePromociones
                    )
                }

                // Chips de categorías
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    item {
                        FilterChip(
                            selected = state.selectedCategoriaId == null,
                            onClick = { viewModel.onCategoriaSelect(null) },
                            label = { Text("Todos") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = colorVerdeClaro,
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                    items(state.categorias) { cat ->
                        FilterChip(
                            selected = state.selectedCategoriaId == cat.id,
                            onClick = { viewModel.onCategoriaSelect(cat.id) },
                            label = { Text(cat.nombre) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = colorVerdeClaro,
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Contenido principal: packs + productos
                if (state.isLoadingProductos && state.productos.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = colorVerde)
                    }
                } else {
                    LazyColumn(
                        contentPadding = PaddingValues(
                            start = 12.dp, end = 12.dp,
                            top = 4.dp,
                            bottom = if (state.cartItemCount > 0) 80.dp else 16.dp
                        ),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Sección de packs (cuando hay búsqueda activa)
                        if (state.packs.isNotEmpty()) {
                            item {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(top = 4.dp, bottom = 2.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Inventory2,
                                        contentDescription = null,
                                        tint = colorMorado,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        "Packs (${state.packs.size})",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.SemiBold,
                                        color = colorMorado
                                    )
                                }
                            }
                            items(state.packs, key = { "pack_${it.id}" }) { pack ->
                                PackCard(
                                    pack = pack,
                                    enCarrito = state.cart.find { it.packId == pack.id }?.cantidad ?: 0,
                                    onAgregar = { viewModel.addPackToCart(pack) }
                                )
                            }
                            if (state.productos.isNotEmpty()) {
                                item {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(top = 4.dp, bottom = 2.dp)
                                    ) {
                                        Text(
                                            "Productos",
                                            style = MaterialTheme.typography.labelMedium,
                                            fontWeight = FontWeight.SemiBold,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                        }

                        // Productos
                        if (state.productos.isEmpty() && state.packs.isEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier.fillMaxWidth().height(200.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        "No se encontraron productos",
                                        style = MaterialTheme.typography.bodyLarge,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }

                        items(state.productos, key = { "prod_${it.id}" }) { producto ->
                            val tienePromo = state.promociones.any { promo ->
                                promo.activa && promo.productos.any { pp -> pp.producto.id == producto.id }
                            }
                            ProductoCard(
                                producto = producto,
                                enCarrito = state.cart.find { it.producto?.id == producto.id }?.cantidad ?: 0,
                                tienePromocion = tienePromo,
                                onAgregar = { viewModel.addToCart(producto) }
                            )
                        }
                    }
                }
            }

            // Barra inferior del carrito
            if (state.cartItemCount > 0) {
                Surface(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .fillMaxWidth(),
                    color = colorVerde,
                    shadowElevation = 8.dp
                ) {
                    Row(
                        modifier = Modifier
                            .clickable { viewModel.toggleCart() }
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .background(Color.White.copy(alpha = 0.2f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("${state.cartItemCount}", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Ver carrito", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                        }
                        Text("S/ ${"%.2f".format(state.total)}", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                }
            }
        }
    }

    // Bottom Sheet del carrito
    if (state.showCart) {
        ModalBottomSheet(
            onDismissRequest = { viewModel.toggleCart() },
            sheetState = cartSheetState
        ) {
            CartBottomSheet(
                state = state,
                onUpdateCantidad = viewModel::updateCantidadByKey,
                onRemove = viewModel::removeFromCartByKey,
                onDescuentoChange = viewModel::onDescuentoChange,
                onFormaPagoChange = viewModel::onFormaPagoChange,
                onFormaPago1Change = viewModel::onFormaPago1Change,
                onFormaPago2Change = viewModel::onFormaPago2Change,
                onMontoPago1Change = viewModel::onMontoPago1Change,
                onSelectCliente = { viewModel.setShowClienteSearch(true) },
                onRemoveCliente = { viewModel.onClienteSelect(null) },
                onFechaVencimientoChange = viewModel::onFechaVencimientoChange,
                onReferenciaChange = viewModel::onReferenciaChange,
                onAplicarIgvChange = viewModel::onAplicarIgvChange,
                onPuntosInputChange = viewModel::onPuntosInputChange,
                onAplicarPuntos = viewModel::aplicarPuntos,
                onQuitarPuntos = viewModel::quitarPuntos,
                onConfirmar = viewModel::confirmarVenta,
                isProcessing = state.isProcessing
            )
        }
    }

    // Modal búsqueda de cliente
    if (state.showClienteSearch) {
        ClienteSearchDialog(
            state = state,
            onSearchChange = viewModel::onClienteSearchChange,
            onSelect = viewModel::onClienteSelect,
            onDismiss = { viewModel.setShowClienteSearch(false) }
        )
    }

    // Dialog de venta exitosa
    state.ventaExitosa?.let { venta ->
        VentaExitosaDialog(
            venta = venta,
            comprobanteEmitido = state.comprobanteEmitido,
            onEmitirBoleta = viewModel::showEmitirBoleta,
            onEmitirFactura = viewModel::showEmitirFactura,
            onDismiss = viewModel::resetVenta
        )
    }

    if (state.showEmitirDialog == EmitirTipo.BOLETA) {
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
            onDismiss = viewModel::dismissEmitirDialog
        )
    }

    if (state.showEmitirDialog == EmitirTipo.FACTURA) {
        EmitirFacturaDialog(
            ruc = state.emitirRuc,
            razonSocial = state.emitirRazonSocial,
            isEmitiendo = state.isEmitiendo,
            error = state.emitirError,
            onRucChange = viewModel::onEmitirRucChange,
            onRazonSocialChange = viewModel::onEmitirRazonSocialChange,
            onConfirmar = viewModel::emitirFactura,
            onDismiss = viewModel::dismissEmitirDialog
        )
    }
}

// ─── Panel de Promociones ─────────────────────────────────────────────────────

@Composable
private fun PromocionesPanel(
    promociones: List<PromocionDto>,
    expanded: Boolean,
    onToggle: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = colorMorado.copy(alpha = 0.08f)),
        shape = RoundedCornerShape(10.dp)
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onToggle() }
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.LocalOffer,
                    contentDescription = null,
                    tint = colorMorado,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    "${promociones.size} promoción${if (promociones.size != 1) "es" else ""} activa${if (promociones.size != 1) "s" else ""}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = colorMorado,
                    modifier = Modifier.weight(1f)
                )
                Icon(
                    if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = colorMorado,
                    modifier = Modifier.size(20.dp)
                )
            }

            AnimatedVisibility(
                visible = expanded,
                enter = expandVertically(),
                exit = shrinkVertically()
            ) {
                Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)) {
                    Divider(color = colorMorado.copy(alpha = 0.2f))
                    Spacer(modifier = Modifier.height(6.dp))
                    promociones.forEach { promo ->
                        PromocionItem(promo)
                        Spacer(modifier = Modifier.height(6.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun PromocionItem(promo: PromocionDto) {
    Row(verticalAlignment = Alignment.Top) {
        Surface(
            shape = RoundedCornerShape(4.dp),
            color = colorMorado.copy(alpha = 0.15f)
        ) {
            Text(
                text = when (promo.tipo) {
                    "DESCUENTO_PORCENTAJE" -> "${promo.descuentoPorcentaje?.toInt()}%"
                    "DESCUENTO_MONTO" -> "-S/${promo.descuentoMonto}"
                    "CANTIDAD" -> "Lleva y paga"
                    else -> promo.tipo
                },
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                color = colorMorado,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
        }
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(promo.nombre, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.SemiBold, color = colorMorado)
            if (promo.productos.isNotEmpty()) {
                Text(
                    promo.productos.joinToString(", ") { it.producto.nombre },
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

// ─── Pack Card ────────────────────────────────────────────────────────────────

@Composable
private fun PackCard(
    pack: PackDto,
    enCarrito: Int,
    onAgregar: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(2.dp),
        colors = CardDefaults.cardColors(containerColor = colorMorado.copy(alpha = 0.05f))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Icono pack
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(colorMorado.copy(alpha = 0.15f), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Inventory2, contentDescription = null, tint = colorMorado, modifier = Modifier.size(24.dp))
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = pack.nombre,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f)
                    )
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = colorMorado.copy(alpha = 0.15f)
                    ) {
                        Text(
                            "Pack",
                            modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp),
                            color = colorMorado,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                // Composición del pack
                if (pack.productos.isNotEmpty()) {
                    Text(
                        text = pack.productos.joinToString(" · ") { "${it.cantidad}× ${it.producto.nombre}" },
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "S/ ${"%.2f".format(pack.precioPack)}",
                    fontWeight = FontWeight.Bold,
                    color = colorMorado,
                    fontSize = 16.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (enCarrito > 0) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = colorMorado.copy(alpha = 0.15f)
                        ) {
                            Text(
                                "×$enCarrito",
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                color = colorMorado,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.width(4.dp))
                    }
                    FilledTonalButton(
                        onClick = onAgregar,
                        contentPadding = PaddingValues(0.dp),
                        modifier = Modifier.size(32.dp),
                        shape = CircleShape,
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = colorMorado,
                            contentColor = Color.White
                        )
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Agregar pack", modifier = Modifier.size(18.dp))
                    }
                }
            }
        }
    }
}

// ─── Producto Card ────────────────────────────────────────────────────────────

@Composable
private fun ProductoCard(
    producto: ProductoDto,
    enCarrito: Int,
    tienePromocion: Boolean,
    onAgregar: () -> Unit
) {
    val sinStock = producto.stockActual <= 0
    val stockBajo = !sinStock && (producto.stockMinimo?.let { producto.stockActual <= it } == true)
    val stockColor = when {
        sinStock -> colorRojo
        stockBajo -> colorNaranja
        else -> colorVerdeClaro
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(2.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (sinStock) MaterialTheme.colorScheme.surfaceVariant
            else MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .background(stockColor.copy(alpha = 0.12f), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "${producto.stockActual}", color = stockColor, fontWeight = FontWeight.Bold, fontSize = 14.sp, textAlign = TextAlign.Center)
                Text(text = "stock", color = stockColor.copy(alpha = 0.7f), fontSize = 8.sp, modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 2.dp))
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = producto.nombre,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f)
                    )
                    if (tienePromocion) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = colorMorado.copy(alpha = 0.15f)
                        ) {
                            Text(
                                "Promo",
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp),
                                color = colorMorado,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
                if (!producto.marca.isNullOrBlank()) {
                    Text(text = producto.marca, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                producto.categoria?.let {
                    Text(text = it.nombre, style = MaterialTheme.typography.labelSmall, color = colorVerdeClaro)
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            Column(horizontalAlignment = Alignment.End) {
                Text(text = "S/ ${"%.2f".format(producto.precioVenta)}", fontWeight = FontWeight.Bold, color = colorVerde, fontSize = 16.sp)
                Spacer(modifier = Modifier.height(4.dp))
                if (sinStock) {
                    Surface(shape = RoundedCornerShape(4.dp), color = colorRojo.copy(alpha = 0.1f)) {
                        Text("Sin stock", modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), color = colorRojo, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                    }
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (enCarrito > 0) {
                            Surface(shape = RoundedCornerShape(4.dp), color = colorVerdeClaro.copy(alpha = 0.15f)) {
                                Text("×$enCarrito", modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), color = colorVerdeClaro, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Spacer(modifier = Modifier.width(4.dp))
                        }
                        FilledTonalButton(
                            onClick = onAgregar,
                            contentPadding = PaddingValues(0.dp),
                            modifier = Modifier.size(32.dp),
                            shape = CircleShape,
                            colors = ButtonDefaults.filledTonalButtonColors(containerColor = colorVerde, contentColor = Color.White)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Agregar", modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}

// ─── Cart Bottom Sheet ────────────────────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CartBottomSheet(
    state: PosUiState,
    onUpdateCantidad: (String, Int) -> Unit,
    onRemove: (String) -> Unit,
    onDescuentoChange: (String) -> Unit,
    onFormaPagoChange: (FormaPago) -> Unit,
    onFormaPago1Change: (FormaPago) -> Unit,
    onFormaPago2Change: (FormaPago) -> Unit,
    onMontoPago1Change: (String) -> Unit,
    onSelectCliente: () -> Unit,
    onRemoveCliente: () -> Unit,
    onFechaVencimientoChange: (String) -> Unit,
    onReferenciaChange: (String) -> Unit,
    onAplicarIgvChange: (Boolean) -> Unit,
    onPuntosInputChange: (String) -> Unit,
    onAplicarPuntos: () -> Unit,
    onQuitarPuntos: () -> Unit,
    onConfirmar: () -> Unit,
    isProcessing: Boolean
) {
    LazyColumn(contentPadding = PaddingValues(bottom = 24.dp)) {
        // Encabezado
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Carrito", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                Text(
                    "${state.cartItemCount} ${if (state.cartItemCount == 1) "ítem" else "ítems"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
        }

        // Items del carrito
        itemsIndexed(state.cart, key = { _, item -> item.itemKey }) { index, item ->
            CartItemRow(
                item = item,
                onIncrease = { onUpdateCantidad(item.itemKey, item.cantidad + 1) },
                onDecrease = { onUpdateCantidad(item.itemKey, item.cantidad - 1) },
                onRemove = { onRemove(item.itemKey) }
            )
            if (index < state.cart.size - 1) {
                Divider(modifier = Modifier.padding(horizontal = 16.dp), thickness = 0.5.dp)
            }
        }

        // Cliente
        item {
            Spacer(modifier = Modifier.height(12.dp))
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Person, contentDescription = null, tint = colorVerde, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                if (state.selectedCliente != null) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(state.selectedCliente.nombre, fontWeight = FontWeight.Medium, style = MaterialTheme.typography.bodyMedium)
                            if (state.configFidelizacion?.activo == true && state.puntosDisponibles > 0) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Surface(
                                    color = Color(0xFFFFF9C4),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFF9A825), modifier = Modifier.size(12.dp))
                                        Spacer(modifier = Modifier.width(2.dp))
                                        Text("${state.puntosDisponibles} pts", style = MaterialTheme.typography.labelSmall, color = Color(0xFFF57F17))
                                    }
                                }
                            }
                        }
                        Text(
                            "${state.selectedCliente.tipoDocumento}: ${state.selectedCliente.numeroDocumento}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onRemoveCliente, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Quitar cliente", modifier = Modifier.size(16.dp))
                    }
                } else {
                    Text("Consumidor final", modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.bodyMedium)
                    TextButton(onClick = onSelectCliente) { Text("Buscar cliente", color = colorVerde) }
                }
            }
        }

        // Canje de puntos (solo si el cliente tiene puntos y no es venta a crédito)
        if (state.canCanjearPuntos) {
            item {
                val colorAmbar = Color(0xFFF57F17)
                val bgAmbar = Color(0xFFFFFDE7)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp),
                    colors = CardDefaults.cardColors(containerColor = bgAmbar),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Star, contentDescription = null, tint = colorAmbar, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                "Canjear puntos (${state.configFidelizacion?.puntosPorSolDescuento?.toInt()} pts = S/ 1)",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = colorAmbar
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        if (state.puntosCanjeados > 0) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    "✓ ${state.puntosCanjeados} pts → -S/ ${"%.2f".format(state.descuentoPuntos)}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Color(0xFF2E7D32),
                                    fontWeight = FontWeight.Medium
                                )
                                TextButton(
                                    onClick = onQuitarPuntos,
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 0.dp)
                                ) {
                                    Text("Quitar", color = colorRojo, style = MaterialTheme.typography.labelSmall)
                                }
                            }
                        } else {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = state.puntosInput,
                                    onValueChange = onPuntosInputChange,
                                    modifier = Modifier.weight(1f),
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    label = { Text("Puntos a canjear") },
                                    placeholder = { Text("Máx ${minOf(state.puntosDisponibles, state.configFidelizacion?.maxPuntosCanjeporVenta ?: 500)}") }
                                )
                                Button(
                                    onClick = onAplicarPuntos,
                                    enabled = state.puntosInput.toIntOrNull() != null && (state.puntosInput.toIntOrNull() ?: 0) > 0,
                                    colors = ButtonDefaults.buttonColors(containerColor = colorAmbar),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Text("Aplicar", style = MaterialTheme.typography.labelMedium)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Descuento manual
        item {
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Descuento (%)", modifier = Modifier.weight(1f), style = MaterialTheme.typography.bodyMedium)
                OutlinedTextField(
                    value = state.descuentoPct,
                    onValueChange = onDescuentoChange,
                    modifier = Modifier.width(100.dp),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    placeholder = { Text("0") },
                    suffix = { Text("%") }
                )
            }
        }

        // Forma de pago
        item {
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
            Text(
                "Forma de pago",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                fontWeight = FontWeight.SemiBold,
                style = MaterialTheme.typography.bodyMedium
            )
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(FormaPago.entries) { forma ->
                    FilterChip(
                        selected = state.formaPago == forma,
                        onClick = { onFormaPagoChange(forma) },
                        label = { Text(forma.label) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = colorVerdeClaro,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            if (state.formaPago == FormaPago.MIXTO) {
                Spacer(modifier = Modifier.height(8.dp))
                // Selección del primer método MIXTO
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(FormaPago.entries.filter { it != FormaPago.MIXTO && it != FormaPago.CREDITO && it != state.formaPago2 }) { forma ->
                        FilterChip(
                            selected = state.formaPago1 == forma,
                            onClick = { onFormaPago1Change(forma) },
                            label = { Text(forma.label, fontSize = 12.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = colorVerdeClaro,
                                selectedLabelColor = Color.White
                            )
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = state.montoPago1,
                        onValueChange = onMontoPago1Change,
                        modifier = Modifier.width(130.dp),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        label = { Text("${state.formaPago1.label} (S/)") }
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("+", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(FormaPago.entries.filter { it != FormaPago.MIXTO && it != FormaPago.CREDITO && it != state.formaPago1 }) { forma ->
                                FilterChip(
                                    selected = state.formaPago2 == forma,
                                    onClick = { onFormaPago2Change(forma) },
                                    label = { Text(forma.label, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = colorAzul,
                                        selectedLabelColor = Color.White
                                    )
                                )
                            }
                        }
                        Text(
                            "${state.formaPago2.label}: S/ ${"%.2f".format(state.montoPago2)}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Monto recibido para EFECTIVO (permite calcular vuelto)
            if (state.formaPago == FormaPago.EFECTIVO) {
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = state.montoPago1,
                        onValueChange = onMontoPago1Change,
                        modifier = Modifier.width(160.dp),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        label = { Text("Monto recibido (S/)") },
                        placeholder = { Text("Opcional") }
                    )
                    if (state.montoPago1Num > 0 && state.montoPago1Num >= state.total) {
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text("Vuelto", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(
                                "S/ ${"%.2f".format(state.montoPago1Num - state.total)}",
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = colorAzul
                            )
                        }
                    }
                }
            }

            // Referencia para Yape / Plin
            if (state.formaPago == FormaPago.YAPE || state.formaPago == FormaPago.PLIN) {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = state.referencia,
                    onValueChange = onReferenciaChange,
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                    singleLine = true,
                    label = { Text("N° operación (opcional)") },
                    placeholder = { Text("Referencia ${state.formaPago.label}") }
                )
            }

            // Crédito / Fiado: fecha de vencimiento
            if (state.formaPago == FormaPago.CREDITO) {
                Spacer(modifier = Modifier.height(8.dp))
                CreditoFechaSection(
                    fecha = state.fechaVencimientoCredito,
                    onFechaChange = onFechaVencimientoChange
                )
            }
        }

        // IGV toggle
        item {
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("Aplicar IGV (18%)", style = MaterialTheme.typography.bodyMedium)
                    if (state.aplicarIgv) {
                        Text("+S/ ${"%.2f".format(state.igvAmount)}", style = MaterialTheme.typography.bodySmall, color = colorNaranja)
                    }
                }
                Switch(
                    checked = state.aplicarIgv,
                    onCheckedChange = onAplicarIgvChange,
                    colors = SwitchDefaults.colors(checkedTrackColor = colorVerde)
                )
            }
        }

        // Resumen de totales
        item {
            Spacer(modifier = Modifier.height(12.dp))
            Divider(modifier = Modifier.padding(horizontal = 16.dp))
            Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)) {
                ResumenFila("Subtotal", state.subtotalBruto)
                if (state.descuentoPromoTotal > 0) {
                    ResumenFila("Desc. Promociones", -state.descuentoPromoTotal, colorMorado)
                }
                if (state.descuentoAmount > 0) {
                    ResumenFila("Desc. Manual (${state.descuentoPct}%)", -state.descuentoAmount, colorRojo)
                }
                if (state.descuentoPuntos > 0) {
                    ResumenFila("⭐ Canje ${state.puntosCanjeados} pts", -state.descuentoPuntos, Color(0xFFF57F17))
                }
                if (state.aplicarIgv) {
                    ResumenFila("IGV (18%)", state.igvAmount, colorNaranja)
                }
                Divider(modifier = Modifier.padding(vertical = 6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("TOTAL", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Text("S/ ${"%.2f".format(state.total)}", fontWeight = FontWeight.Bold, color = colorVerde, style = MaterialTheme.typography.titleLarge)
                }
            }
        }

        // Botón confirmar
        item {
            Button(
                onClick = onConfirmar,
                enabled = !isProcessing && state.cart.isNotEmpty(),
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp).height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isProcessing) {
                    CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White, strokeWidth = 2.dp)
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(
                    if (isProcessing) "Procesando..." else "Confirmar Venta — S/ ${"%.2f".format(state.total)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
            }
        }
    }
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────

@Composable
private fun CartItemRow(
    item: CartItem,
    onIncrease: () -> Unit,
    onDecrease: () -> Unit,
    onRemove: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (item.isPack) {
                        Surface(shape = RoundedCornerShape(4.dp), color = colorMorado.copy(alpha = 0.15f)) {
                            Text("Pack", modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp), color = colorMorado, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text(
                        item.nombreDisplay,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.weight(1f)
                    )
                }
                if (item.isPack && item.packProductos.isNotEmpty()) {
                    Text(
                        item.packProductos.joinToString(" · ") { "${it.cantidad}× ${it.nombre}" },
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (item.descuentoPromo > 0) {
                        Text(
                            "S/ ${"%.2f".format(item.precioUnitario)} c/u",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textDecoration = TextDecoration.LineThrough
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            "-S/ ${"%.2f".format(item.descuentoPromo)}",
                            style = MaterialTheme.typography.bodySmall,
                            color = colorMorado,
                            fontWeight = FontWeight.Medium
                        )
                    } else {
                        Text(
                            "S/ ${"%.2f".format(item.precioUnitario)} c/u",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.width(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onDecrease, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Remove, contentDescription = "Disminuir", modifier = Modifier.size(16.dp), tint = colorVerde)
                }
                Text("${item.cantidad}", modifier = Modifier.width(28.dp), textAlign = TextAlign.Center, fontWeight = FontWeight.Bold)
                IconButton(onClick = onIncrease, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Add, contentDescription = "Aumentar", modifier = Modifier.size(16.dp), tint = colorVerde)
                }
            }
            Spacer(modifier = Modifier.width(4.dp))
            Column(horizontalAlignment = Alignment.End, modifier = Modifier.width(64.dp)) {
                if (item.descuentoPromo > 0) {
                    Text(
                        "S/ ${"%.2f".format(item.subtotalConDescuento)}",
                        fontWeight = FontWeight.SemiBold,
                        color = colorMorado,
                        textAlign = TextAlign.End,
                        style = MaterialTheme.typography.bodyMedium
                    )
                } else {
                    Text(
                        "S/ ${"%.2f".format(item.subtotal)}",
                        fontWeight = FontWeight.SemiBold,
                        color = colorVerde,
                        textAlign = TextAlign.End,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
            IconButton(onClick = onRemove, modifier = Modifier.size(32.dp)) {
                Icon(Icons.Default.Delete, contentDescription = "Eliminar", tint = colorRojo, modifier = Modifier.size(16.dp))
            }
        }
    }
}

@Composable
private fun ResumenFila(label: String, valor: Double, color: Color = MaterialTheme.colorScheme.onSurface) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(
            "S/ ${"%.2f".format(abs(valor))}".let { if (valor < 0) "-$it" else it },
            fontWeight = FontWeight.Medium,
            color = color,
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

// ─── Crédito / Fiado: selector de fecha ──────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CreditoFechaSection(
    fecha: String,
    onFechaChange: (String) -> Unit
) {
    var showDatePicker by remember { mutableStateOf(false) }
    val datePickerState = rememberDatePickerState(
        initialSelectedDateMillis = System.currentTimeMillis()
    )

    if (showDatePicker) {
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    val millis = datePickerState.selectedDateMillis
                    if (millis != null) {
                        val formatted = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date(millis))
                        onFechaChange(formatted)
                    }
                    showDatePicker = false
                }) { Text("Aceptar") }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) { Text("Cancelar") }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFDE7)),
        shape = RoundedCornerShape(10.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                "Venta a crédito (fiado)",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFFF57F17)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = fecha,
                    onValueChange = onFechaChange,
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    label = { Text("Fecha vencimiento") },
                    placeholder = { Text("yyyy-MM-dd") },
                    readOnly = true
                )
                IconButton(onClick = { showDatePicker = true }) {
                    Icon(Icons.Default.CalendarMonth, contentDescription = "Seleccionar fecha", tint = Color(0xFFF57F17))
                }
            }
            if (fecha.isNotBlank()) {
                Text("Vence: $fecha", style = MaterialTheme.typography.bodySmall, color = Color(0xFF5D4037))
            } else {
                Text("Sin fecha = sin vencimiento", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

// ─── Cliente Search Dialog ────────────────────────────────────────────────────

@Composable
private fun ClienteSearchDialog(
    state: PosUiState,
    onSearchChange: (String) -> Unit,
    onSelect: (ClienteDto) -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth().padding(16.dp)) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Buscar cliente", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = state.clienteSearch,
                    onValueChange = onSearchChange,
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("Nombre o número de documento...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(8.dp))
                when {
                    state.isLoadingClientes -> {
                        Box(modifier = Modifier.fillMaxWidth().height(80.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = colorVerde, modifier = Modifier.size(28.dp))
                        }
                    }
                    state.clientes.isEmpty() && state.clienteSearch.length >= 2 -> {
                        Text("No se encontraron clientes", modifier = Modifier.padding(vertical = 16.dp), color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
                    }
                    else -> {
                        LazyColumn(modifier = Modifier.heightIn(max = 300.dp)) {
                            items(state.clientes) { cliente ->
                                Row(
                                    modifier = Modifier.fillMaxWidth().clickable { onSelect(cliente) }.padding(vertical = 10.dp, horizontal = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Default.Person, contentDescription = null, tint = colorVerde, modifier = Modifier.size(20.dp))
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(cliente.nombre, fontWeight = FontWeight.Medium, style = MaterialTheme.typography.bodyMedium)
                                        Text("${cliente.tipoDocumento}: ${cliente.numeroDocumento}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                }
                                Divider(thickness = 0.5.dp)
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
                TextButton(onClick = onDismiss, modifier = Modifier.align(Alignment.End)) { Text("Cancelar") }
            }
        }
    }
}

// ─── Venta Exitosa Dialog ─────────────────────────────────────────────────────

@Composable
private fun VentaExitosaDialog(
    venta: com.licoreria.chilalo.data.remote.VentaDto,
    comprobanteEmitido: ComprobanteEmitidoDto?,
    onEmitirBoleta: () -> Unit,
    onEmitirFactura: () -> Unit,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = colorVerdeClaro, modifier = Modifier.size(64.dp))
                Spacer(modifier = Modifier.height(10.dp))
                Text("¡Venta Completada!", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = colorVerde)
                Spacer(modifier = Modifier.height(6.dp))
                Text(venta.numeroVenta, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(modifier = Modifier.height(14.dp))

                Surface(shape = RoundedCornerShape(12.dp), color = colorVerde.copy(alpha = 0.08f), modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        InfoFila("Forma de pago", venta.formaPago)
                        if (venta.descuento > 0) InfoFila("Descuento", "S/ ${"%.2f".format(venta.descuento)}")
                        InfoFila("Total", "S/ ${"%.2f".format(venta.total)}", bold = true)
                        if (venta.vuelto > 0) InfoFila("Vuelto", "S/ ${"%.2f".format(venta.vuelto)}", color = colorAzul)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (comprobanteEmitido != null) {
                    Surface(shape = RoundedCornerShape(8.dp), color = colorAzul.copy(alpha = 0.1f), modifier = Modifier.fillMaxWidth()) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Description, contentDescription = null, tint = colorAzul, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("Comprobante emitido", style = MaterialTheme.typography.labelSmall, color = colorAzul)
                                val num = listOfNotNull(comprobanteEmitido.serie, comprobanteEmitido.numero).joinToString("-")
                                if (num.isNotBlank()) Text(num, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium, color = colorAzul)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(14.dp))
                } else {
                    Text("Generar comprobante", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = onEmitirBoleta, modifier = Modifier.weight(1f), shape = RoundedCornerShape(8.dp)) { Text("Boleta", fontSize = 13.sp) }
                        OutlinedButton(onClick = onEmitirFactura, modifier = Modifier.weight(1f), shape = RoundedCornerShape(8.dp)) { Text("Factura", fontSize = 13.sp) }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                }

                Button(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Nueva Venta", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun InfoFila(label: String, value: String, bold: Boolean = false, color: Color = Color.Unspecified) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal, color = if (color != Color.Unspecified) color else MaterialTheme.colorScheme.onSurface, style = MaterialTheme.typography.bodyMedium)
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

                ExposedDropdownMenuBox(expanded = expandedTipoDoc, onExpandedChange = { expandedTipoDoc = it }) {
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
                OutlinedTextField(value = numDoc, onValueChange = onNumDocChange, label = { Text("Número de documento") }, modifier = Modifier.fillMaxWidth(), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number))
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(value = nombre, onValueChange = onNombreChange, label = { Text("Nombre completo") }, modifier = Modifier.fillMaxWidth(), singleLine = true)

                error?.let {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(it, color = colorRojo, style = MaterialTheme.typography.bodySmall)
                }

                Spacer(modifier = Modifier.height(16.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancelar") }
                    Button(
                        onClick = onConfirmar,
                        modifier = Modifier.weight(1f),
                        enabled = !isEmitiendo,
                        colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        if (isEmitiendo) CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
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
                OutlinedTextField(value = ruc, onValueChange = onRucChange, label = { Text("RUC") }, modifier = Modifier.fillMaxWidth(), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number))
                Spacer(modifier = Modifier.height(10.dp))
                OutlinedTextField(value = razonSocial, onValueChange = onRazonSocialChange, label = { Text("Razón social") }, modifier = Modifier.fillMaxWidth(), singleLine = true)

                error?.let {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(it, color = colorRojo, style = MaterialTheme.typography.bodySmall)
                }

                Spacer(modifier = Modifier.height(16.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancelar") }
                    Button(
                        onClick = onConfirmar,
                        modifier = Modifier.weight(1f),
                        enabled = !isEmitiendo,
                        colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        if (isEmitiendo) CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                        else Text("Emitir")
                    }
                }
            }
        }
    }
}
