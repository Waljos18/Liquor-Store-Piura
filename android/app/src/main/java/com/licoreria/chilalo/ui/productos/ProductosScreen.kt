@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package com.licoreria.chilalo.ui.productos

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Badge
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.licoreria.chilalo.data.remote.CategoriaDto
import com.licoreria.chilalo.data.remote.ProductoDto
import com.licoreria.chilalo.ui.scanner.BarcodeScannerScreen

private val colorPrimario = Color(0xFF1565C0)

@Composable
fun ProductosScreen(
    viewModel: ProductosViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val listState = rememberLazyListState()

    val shouldLoadMore by remember {
        derivedStateOf {
            val last = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            last >= state.productos.size - 3
        }
    }

    LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore) viewModel.loadNextPage()
    }

    LaunchedEffect(state.error) {
        state.error?.let { snackbarHostState.showSnackbar(it); viewModel.dismissError() }
    }

    LaunchedEffect(state.successMessage) {
        state.successMessage?.let { snackbarHostState.showSnackbar(it); viewModel.dismissSuccess() }
    }

    // Overlay scanner
    if (state.showScanner) {
        BarcodeScannerScreen(
            title = when (state.scannerTarget) {
                ScannerTarget.SEARCH -> "Escanear para buscar"
                ScannerTarget.BARCODE_FIELD -> "Escanear código del producto"
            },
            onBarcodeDetected = { viewModel.onBarcodeScanned(it) },
            onClose = { viewModel.closeScanner() }
        )
        return
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Productos", fontWeight = FontWeight.Bold)
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = colorPrimario,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White
                ),
                actions = {
                    IconButton(onClick = { viewModel.openScanner(ScannerTarget.SEARCH) }) {
                        Icon(Icons.Default.QrCodeScanner, contentDescription = "Buscar por código")
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { viewModel.openCrear() },
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text("Nuevo producto") },
                containerColor = colorPrimario,
                contentColor = Color.White
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Barra de búsqueda
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = state.search,
                    onValueChange = viewModel::onSearchChange,
                    placeholder = { Text("Buscar por nombre o código...") },
                    leadingIcon = { Icon(Icons.Default.Search, null) },
                    trailingIcon = {
                        if (state.search.isNotEmpty()) {
                            IconButton(onClick = { viewModel.onSearchChange("") }) {
                                Icon(Icons.Default.Close, null)
                            }
                        }
                    },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )
            }

            // Contador
            if (state.totalElements > 0) {
                Text(
                    "${state.totalElements} productos",
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            when {
                state.isLoading && state.productos.isEmpty() -> {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                }
                state.error != null && state.productos.isEmpty() -> {
                    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                            TextButton(onClick = { viewModel.load() }) { Text("Reintentar") }
                        }
                    }
                }
                else -> {
                    LazyColumn(
                        state = listState,
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 90.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(state.productos, key = { it.id }) { producto ->
                            ProductoCard(
                                producto = producto,
                                onEditClick = { viewModel.openEditar(producto) }
                            )
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

        // Modal editor (crear / editar)
        if (state.showEditor) {
            ProductoEditorSheet(
                state = state,
                onClose = { viewModel.closeEditor() },
                onSave = { viewModel.guardarProducto() },
                onOpenScanner = { viewModel.openScanner(ScannerTarget.BARCODE_FIELD) },
                onCodigoChange = viewModel::onEdCodigoBarrasChange,
                onNombreChange = viewModel::onEdNombreChange,
                onMarcaChange = viewModel::onEdMarcaChange,
                onCategoriaChange = viewModel::onEdCategoriaChange,
                onPrecioVentaChange = viewModel::onEdPrecioVentaChange,
                onPrecioCompraChange = viewModel::onEdPrecioCompraChange,
                onStockChange = viewModel::onEdStockChange,
                onStockMinimoChange = viewModel::onEdStockMinimoChange,
                onFechaVencChange = viewModel::onEdFechaVencChange
            )
        }
    }
}

@Composable
private fun ProductoEditorSheet(
    state: ProductosUiState,
    onClose: () -> Unit,
    onSave: () -> Unit,
    onOpenScanner: () -> Unit,
    onCodigoChange: (String) -> Unit,
    onNombreChange: (String) -> Unit,
    onMarcaChange: (String) -> Unit,
    onCategoriaChange: (Long?) -> Unit,
    onPrecioVentaChange: (String) -> Unit,
    onPrecioCompraChange: (String) -> Unit,
    onStockChange: (String) -> Unit,
    onStockMinimoChange: (String) -> Unit,
    onFechaVencChange: (String) -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val isEditing = state.editingProducto != null

    ModalBottomSheet(
        onDismissRequest = onClose,
        sheetState = sheetState
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState())
                .padding(bottom = 32.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    if (isEditing) "Editar producto" else "Nuevo producto",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                IconButton(onClick = onClose) {
                    Icon(Icons.Default.Close, contentDescription = "Cerrar")
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Código de barras + botón scanner
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = state.edCodigoBarras,
                    onValueChange = onCodigoChange,
                    label = { Text("Código de barras (opcional)") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = onOpenScanner,
                    modifier = Modifier
                        .size(52.dp)
                        .background(colorPrimario, RoundedCornerShape(12.dp))
                ) {
                    Icon(Icons.Default.QrCodeScanner, contentDescription = "Escanear", tint = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = state.edNombre,
                onValueChange = onNombreChange,
                label = { Text("Nombre *") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = state.edMarca,
                onValueChange = onMarcaChange,
                label = { Text("Marca") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Selector de categoría
            CategoriaDropdown(
                categorias = state.categorias,
                selectedId = state.edCategoriaId,
                onSelected = onCategoriaChange
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = state.edPrecioVenta,
                    onValueChange = onPrecioVentaChange,
                    label = { Text("Precio venta *") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    leadingIcon = { Text("S/", fontSize = 13.sp) }
                )
                OutlinedTextField(
                    value = state.edPrecioCompra,
                    onValueChange = onPrecioCompraChange,
                    label = { Text("Precio compra") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    leadingIcon = { Text("S/", fontSize = 13.sp) }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = state.edStock,
                    onValueChange = onStockChange,
                    label = { Text(if (isEditing) "Stock actual" else "Stock inicial") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                OutlinedTextField(
                    value = state.edStockMinimo,
                    onValueChange = onStockMinimoChange,
                    label = { Text("Stock mínimo") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = state.edFechaVenc,
                onValueChange = onFechaVencChange,
                label = { Text("Fecha vencimiento (YYYY-MM-DD)") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                placeholder = { Text("Ej: 2026-12-31") }
            )

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = onSave,
                enabled = !state.isSaving,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colorPrimario)
            ) {
                if (state.isSaving) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.White)
                } else {
                    Text(if (isEditing) "Guardar cambios" else "Crear producto", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun CategoriaDropdown(
    categorias: List<CategoriaDto>,
    selectedId: Long?,
    onSelected: (Long?) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedNombre = categorias.find { it.id == selectedId }?.nombre ?: "Sin categoría"

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it },
        modifier = Modifier.fillMaxWidth()
    ) {
        OutlinedTextField(
            value = selectedNombre,
            onValueChange = {},
            readOnly = true,
            label = { Text("Categoría") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier.menuAnchor().fillMaxWidth()
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            DropdownMenuItem(
                text = { Text("Sin categoría") },
                onClick = { onSelected(null); expanded = false }
            )
            categorias.forEach { cat ->
                DropdownMenuItem(
                    text = { Text(cat.nombre) },
                    onClick = { onSelected(cat.id); expanded = false }
                )
            }
        }
    }
}

@Composable
private fun ProductoCard(
    producto: ProductoDto,
    onEditClick: () -> Unit
) {
    val stockColor = when {
        producto.stockActual <= 0 -> Color(0xFFB71C1C)
        producto.stockMinimo != null && producto.stockActual <= producto.stockMinimo -> Color(0xFFE65100)
        else -> Color(0xFF2E7D32)
    }

    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.Inventory2,
                contentDescription = null,
                tint = colorPrimario,
                modifier = Modifier.size(28.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = producto.nombre,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.SemiBold
                )
                if (!producto.marca.isNullOrBlank()) {
                    Text(
                        texto(producto.marca),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                producto.categoria?.let {
                    Text(
                        it.nombre,
                        style = MaterialTheme.typography.labelSmall,
                        color = colorPrimario
                    )
                }
                if (!producto.codigoBarras.isNullOrBlank()) {
                    Text(
                        "# ${producto.codigoBarras}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    "S/ %.2f".format(producto.precioVenta),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = colorPrimario
                )
                Badge(containerColor = stockColor) {
                    Text("Stock: ${producto.stockActual}", modifier = Modifier.padding(horizontal = 4.dp))
                }
                IconButton(onClick = onEditClick, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Edit, contentDescription = "Editar", tint = colorPrimario, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

private fun texto(s: String?) = s ?: ""
