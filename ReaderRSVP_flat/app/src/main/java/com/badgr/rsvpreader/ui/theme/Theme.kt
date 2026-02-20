package com.badgr.rsvpreader.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// BADGR Technologies Brand Colors
val BADGRBlue = Color(0xFF0000FF)  // Primary blue from logo
val BADGRDarkBlue = Color(0xFF0000CC)
val BADGRLightBlue = Color(0xFF3333FF)
val BADGRWhite = Color(0xFFFFFFFF)
val BADGRBlack = Color(0xFF000000)
val BADGRRed = Color(0xFFFF0000)  // ORP highlight color

private val DarkColorScheme = darkColorScheme(
    primary = BADGRBlue,
    secondary = BADGRLightBlue,
    tertiary = BADGRDarkBlue,
    background = BADGRBlack,
    surface = Color(0xFF1A1A1A),
    onPrimary = BADGRWhite,
    onSecondary = BADGRWhite,
    onTertiary = BADGRWhite,
    onBackground = BADGRWhite,
    onSurface = BADGRWhite,
)

private val LightColorScheme = lightColorScheme(
    primary = BADGRBlue,
    secondary = BADGRLightBlue,
    tertiary = BADGRDarkBlue,
    background = BADGRWhite,
    surface = Color(0xFFF5F5F5),
    onPrimary = BADGRWhite,
    onSecondary = BADGRWhite,
    onTertiary = BADGRWhite,
    onBackground = BADGRBlack,
    onSurface = BADGRBlack,
)

@Composable
fun RSVPReaderTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
