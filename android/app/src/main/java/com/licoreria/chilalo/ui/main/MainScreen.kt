package com.licoreria.chilalo.ui.main

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Liquor
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.PointOfSale
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.licoreria.chilalo.ui.clientes.ClientesScreen
import com.licoreria.chilalo.ui.dashboard.DashboardScreen
import com.licoreria.chilalo.ui.inventario.InventarioScreen
import com.licoreria.chilalo.ui.pos.POSScreen
import com.licoreria.chilalo.ui.productos.ProductosScreen
import com.licoreria.chilalo.ui.ventas.VentasScreen

private sealed class MainTab(
    val route: String,
    val label: String,
    val icon: ImageVector
) {
    object Dashboard : MainTab("dashboard", "Inicio", Icons.Default.Home)
    object POS : MainTab("pos", "Caja", Icons.Default.PointOfSale)
    object Productos : MainTab("productos", "Productos", Icons.Default.Liquor)
    object Ventas : MainTab("ventas", "Ventas", Icons.Default.Receipt)
    object Inventario : MainTab("inventario", "Inventario", Icons.Default.Inventory2)
    object Clientes : MainTab("clientes", "Clientes", Icons.Default.People)
}

private val tabs = listOf(
    MainTab.Dashboard,
    MainTab.POS,
    MainTab.Productos,
    MainTab.Ventas,
    MainTab.Inventario,
    MainTab.Clientes
)

@Composable
fun MainScreen(onLogout: () -> Unit) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.65f),
                tonalElevation = 3.dp
            ) {
                tabs.forEach { tab ->
                    val selected =
                        currentDestination?.hierarchy?.any { it.route == tab.route } == true
                    NavigationBarItem(
                        icon = { Icon(tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label) },
                        selected = selected,
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.primary,
                            selectedTextColor = MaterialTheme.colorScheme.primary,
                            indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        onClick = {
                            navController.navigate(tab.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = MainTab.POS.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(MainTab.Dashboard.route) { DashboardScreen(onLogout = onLogout) }
            composable(MainTab.POS.route) { POSScreen() }
            composable(MainTab.Productos.route) { ProductosScreen() }
            composable(MainTab.Ventas.route) { VentasScreen() }
            composable(MainTab.Inventario.route) { InventarioScreen() }
            composable(MainTab.Clientes.route) { ClientesScreen() }
        }
    }
}
