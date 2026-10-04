package com.licoreria.chilalo.ui.clientes

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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
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
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import com.licoreria.chilalo.data.remote.ClienteDto

private val colorVerde = Color(0xFF1B5E20)
private val colorAmarillo = Color(0xFFF57F17)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClientesScreen(
    viewModel: ClientesViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()

    val shouldLoadMore by remember {
        derivedStateOf {
            val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            lastVisible >= state.clientes.size - 3
        }
    }

    LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore) viewModel.loadNextPage()
    }

    if (state.showForm) {
        ClienteFormDialog(
            state = state,
            onTipoDocChange = viewModel::onFormTipoDocChange,
            onNumDocChange = viewModel::onFormNumDocChange,
            onNombreChange = viewModel::onFormNombreChange,
            onTelefonoChange = viewModel::onFormTelefonoChange,
            onEmailChange = viewModel::onFormEmailChange,
            onGuardar = viewModel::guardar,
            onDismiss = viewModel::cerrarForm
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Clientes", fontWeight = FontWeight.Bold) },
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
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = viewModel::abrirCrear,
                containerColor = colorVerde,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Nuevo cliente")
            }
        }
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            OutlinedTextField(
                value = state.search,
                onValueChange = viewModel::onSearchChange,
                placeholder = { Text("Buscar por nombre o documento...") },
                leadingIcon = { Icon(Icons.Default.Search, null) },
                trailingIcon = {
                    if (state.search.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchChange("") }) {
                            Icon(Icons.Default.Close, null)
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                singleLine = true
            )

            when {
                state.isLoading && state.clientes.isEmpty() -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) { CircularProgressIndicator() }

                state.error != null && state.clientes.isEmpty() -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                        TextButton(onClick = { viewModel.load() }) { Text("Reintentar") }
                    }
                }

                state.clientes.isEmpty() -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No se encontraron clientes", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                else -> LazyColumn(
                    state = listState,
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(state.clientes, key = { it.id }) { cliente ->
                        ClienteCard(
                            cliente = cliente,
                            onEditar = { viewModel.abrirEditar(cliente) }
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
}

// ─── Tarjeta de cliente ───────────────────────────────────────────────────────

@Composable
private fun ClienteCard(cliente: ClienteDto, onEditar: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    Icons.Default.Person,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
                Column {
                    Text(
                        text = cliente.nombre,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "${cliente.tipoDocumento}: ${cliente.numeroDocumento}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    cliente.telefono?.let {
                        Text(
                            text = it,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (cliente.puntosFidelizacion > 0) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.Star,
                            contentDescription = null,
                            tint = colorAmarillo,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "${cliente.puntosFidelizacion}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = colorAmarillo
                        )
                    }
                }
                IconButton(onClick = onEditar) {
                    Icon(
                        Icons.Default.Edit,
                        contentDescription = "Editar cliente",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

// ─── Dialog formulario crear/editar ──────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ClienteFormDialog(
    state: ClientesUiState,
    onTipoDocChange: (String) -> Unit,
    onNumDocChange: (String) -> Unit,
    onNombreChange: (String) -> Unit,
    onTelefonoChange: (String) -> Unit,
    onEmailChange: (String) -> Unit,
    onGuardar: () -> Unit,
    onDismiss: () -> Unit
) {
    val tiposDoc = listOf("DNI", "RUC", "CE")
    var expandedTipo by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = if (state.esEdicion) "Editar cliente" else "Nuevo cliente",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Tipo de documento
                ExposedDropdownMenuBox(
                    expanded = expandedTipo,
                    onExpandedChange = { expandedTipo = it }
                ) {
                    OutlinedTextField(
                        value = state.formTipoDoc,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Tipo de documento *") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expandedTipo) },
                        modifier = Modifier.fillMaxWidth().menuAnchor(),
                        singleLine = true
                    )
                    ExposedDropdownMenu(
                        expanded = expandedTipo,
                        onDismissRequest = { expandedTipo = false }
                    ) {
                        tiposDoc.forEach { tipo ->
                            DropdownMenuItem(
                                text = { Text(tipo) },
                                onClick = { onTipoDocChange(tipo); expandedTipo = false }
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))

                // Número de documento
                OutlinedTextField(
                    value = state.formNumDoc,
                    onValueChange = onNumDocChange,
                    label = { Text("Número de documento *") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    isError = state.saveError != null && state.formNumDoc.isBlank()
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Nombre
                OutlinedTextField(
                    value = state.formNombre,
                    onValueChange = onNombreChange,
                    label = { Text("Nombre completo *") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    isError = state.saveError != null && state.formNombre.isBlank()
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Teléfono
                OutlinedTextField(
                    value = state.formTelefono,
                    onValueChange = onTelefonoChange,
                    label = { Text("Teléfono") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                )
                Spacer(modifier = Modifier.height(10.dp))

                // Email
                OutlinedTextField(
                    value = state.formEmail,
                    onValueChange = onEmailChange,
                    label = { Text("Email") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )

                // Error
                state.saveError?.let { error ->
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = error,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TextButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    ) { Text("Cancelar") }
                    Button(
                        onClick = onGuardar,
                        enabled = !state.isSaving,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = colorVerde),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        if (state.isSaving) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text(if (state.esEdicion) "Actualizar" else "Crear")
                        }
                    }
                }
            }
        }
    }
}
