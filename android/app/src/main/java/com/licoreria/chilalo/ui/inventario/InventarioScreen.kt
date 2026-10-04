package com.licoreria.chilalo.ui.inventario

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.licoreria.chilalo.data.remote.ProductoDto

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventarioScreen(
    viewModel: InventarioViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Inventario", fontWeight = FontWeight.Bold) },
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
            TabRow(selectedTabIndex = state.tab.ordinal) {
                Tab(
                    selected = state.tab == InventarioTab.STOCK_BAJO,
                    onClick = { viewModel.setTab(InventarioTab.STOCK_BAJO) },
                    text = {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Warning, null, tint = Color(0xFFE65100))
                            Text("Stock Bajo (${state.stockBajo.size})")
                        }
                    }
                )
                Tab(
                    selected = state.tab == InventarioTab.VENCIMIENTO,
                    onClick = { viewModel.setTab(InventarioTab.VENCIMIENTO) },
                    text = {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Warning, null, tint = Color(0xFFB71C1C))
                            Text("Por vencer (${state.proximosVencer.size})")
                        }
                    }
                )
            }

            when {
                state.isLoading -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) { CircularProgressIndicator() }

                state.error != null -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.error ?: "", color = MaterialTheme.colorScheme.error)
                        TextButton(onClick = { viewModel.load() }) { Text("Reintentar") }
                    }
                }

                else -> {
                    val lista = if (state.tab == InventarioTab.STOCK_BAJO)
                        state.stockBajo else state.proximosVencer

                    if (lista.isEmpty()) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text(
                                text = if (state.tab == InventarioTab.STOCK_BAJO)
                                    "No hay productos con stock bajo" else "No hay productos por vencer",
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(lista, key = { it.id }) { producto ->
                                AlertaProductoCard(
                                    producto = producto,
                                    esVencimiento = state.tab == InventarioTab.VENCIMIENTO
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AlertaProductoCard(producto: ProductoDto, esVencimiento: Boolean) {
    val color = if (esVencimiento) Color(0xFFB71C1C) else Color(0xFFE65100)

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = color.copy(alpha = 0.06f)
        )
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
                    if (esVencimiento) Icons.Default.Warning else Icons.Default.Inventory2,
                    contentDescription = null,
                    tint = color
                )
                Column {
                    Text(
                        text = producto.nombre,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                    producto.categoria?.let {
                        Text(
                            text = it.nombre,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    if (esVencimiento && producto.fechaVencimiento != null) {
                        Text(
                            text = "Vence: ${producto.fechaVencimiento.take(10)}",
                            style = MaterialTheme.typography.labelSmall,
                            color = color,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "Stock: ${producto.stockActual}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = color
                )
                producto.stockMinimo?.let {
                    Text(
                        text = "Mín: $it",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
