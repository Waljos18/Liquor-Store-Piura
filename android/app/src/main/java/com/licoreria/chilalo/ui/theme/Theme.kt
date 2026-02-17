package com.licoreria.chilalo.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val Primary = Color(0xFF1B5E20)
private val OnPrimary = Color.White
private val PrimaryContainer = Color(0xFF2E7D32)
private val SurfaceLight = Color(0xFFF5F5F5)
private val SurfaceDark = Color(0xFF121212)

private val LightColorScheme = lightColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    primaryContainer = PrimaryContainer,
    surface = SurfaceLight,
    error = Color(0xFFB00020)
)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryContainer,
    onPrimary = Color.Black,
    primaryContainer = Primary,
    surface = SurfaceDark,
    error = Color(0xFFCF6679)
)

@Composable
fun ChilaloTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
