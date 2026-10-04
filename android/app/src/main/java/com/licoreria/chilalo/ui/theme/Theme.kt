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

private val VerdeMarca = Color(0xFF1B5E20)
private val VerdeMarcaClaro = Color(0xFF2E7D32)
private val MarronAcento = Color(0xFF5D4037)
private val AmbarAcento = Color(0xFFFFA000)

private val LightColorScheme = lightColorScheme(
    primary = VerdeMarca,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFC8E6C9),
    onPrimaryContainer = Color(0xFF002106),
    secondary = MarronAcento,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFFDCC2),
    onSecondaryContainer = Color(0xFF2C1608),
    tertiary = AmbarAcento,
    onTertiary = Color(0xFF1A1A1A),
    tertiaryContainer = Color(0xFFFFE082),
    onTertiaryContainer = Color(0xFF3D2E00),
    background = Color(0xFFF7FAF7),
    onBackground = Color(0xFF1A1C1A),
    surface = Color(0xFFF7FAF7),
    onSurface = Color(0xFF1A1C1A),
    surfaceVariant = Color(0xFFDEE5DD),
    onSurfaceVariant = Color(0xFF424942),
    error = Color(0xFFBA1A1A),
    onError = Color.White,
    outline = Color(0xFF72796F),
    outlineVariant = Color(0xFFC1C9BF)
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF9CCC9C),
    onPrimary = Color(0xFF00390F),
    primaryContainer = VerdeMarcaClaro,
    onPrimaryContainer = Color(0xFFC8E6C9),
    secondary = Color(0xFFFFB59A),
    onSecondary = Color(0xFF44200C),
    secondaryContainer = Color(0xFF5D4037),
    onSecondaryContainer = Color(0xFFFFDCC2),
    tertiary = Color(0xFFFFD54F),
    onTertiary = Color(0xFF3D2E00),
    tertiaryContainer = Color(0xFF5D4A00),
    onTertiaryContainer = Color(0xFFFFE082),
    background = Color(0xFF101410),
    onBackground = Color(0xFFE0E4E0),
    surface = Color(0xFF101410),
    onSurface = Color(0xFFE0E4E0),
    surfaceVariant = Color(0xFF424942),
    onSurfaceVariant = Color(0xFFC1C9BF),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
    outline = Color(0xFF8B9389),
    outlineVariant = Color(0xFF424942)
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
        typography = ChilaloTypography,
        content = content
    )
}
