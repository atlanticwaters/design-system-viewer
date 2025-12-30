package com.example.designsystem

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// MARK: - Design System Showcase for Android 15
// This file demonstrates standard UI components using Open Sans font
// Can be dropped into any Android project targeting API 35+

// ============================================================================
// DESIGN TOKENS
// ============================================================================

object DSColors {
    // Brand (Primary)
    val Brand025 = Color(0xFFFFFAF6)
    val Brand050 = Color(0xFFFEF2E9)
    val Brand100 = Color(0xFFFEDAC3)
    val Brand200 = Color(0xFFFBA268)
    val Brand300 = Color(0xFFF96302) // Primary
    val Brand400 = Color(0xFFE95C02)
    val Brand500 = Color(0xFFCA5002)

    // Bottle Green (Secondary/Success)
    val Green025 = Color(0xFFFAFCFB)
    val Green050 = Color(0xFFF0F5F3)
    val Green500 = Color(0xFF4A8165) // Secondary
    val Green700 = Color(0xFF226242)

    // Greige (Neutral)
    val Greige025 = Color(0xFFFBFAF9)
    val Greige050 = Color(0xFFF8F5F2)
    val Greige100 = Color(0xFFE5E1DE)
    val Greige200 = Color(0xFFBAB7B4)
    val Greige500 = Color(0xFF787675)
    val Greige700 = Color(0xFF585756)
    val Greige900 = Color(0xFF252524)
    val Greige950 = Color(0xFF0D0D0D)

    // Cinnabar (Error)
    val Error050 = Color(0xFFFDF1F0)
    val Error500 = Color(0xFFDF3427)

    // Lemon (Warning)
    val Warning050 = Color(0xFFFDF6D2)
    val Warning200 = Color(0xFFCFB73A)

    // Moonlight (Info)
    val Info050 = Color(0xFFF3F4F8)
    val Info500 = Color(0xFF6974A5)
}

object DSTypography {
    // Note: In a real app, load Open Sans from Google Fonts
    // val OpenSans = FontFamily(Font(googleFont = GoogleFont("Open Sans")))
    // For this example, we use default sans-serif
    val FontFamily = FontFamily.SansSerif

    // Font sizes
    val BodyXs = 12.sp
    val BodySm = 14.sp
    val BodyMd = 16.sp
    val BodyLg = 18.sp
    val BodyXl = 20.sp

    val H6 = 16.sp
    val H5 = 18.sp
    val H4 = 20.sp
    val H3 = 24.sp
    val H2 = 28.sp
    val H1 = 32.sp

    val Hero5 = 36.sp
    val Hero4 = 40.sp
    val Hero3 = 48.sp
    val Hero2 = 56.sp
    val Hero1 = 64.sp
}

object DSSpacing {
    val Xs = 4.dp
    val Sm = 8.dp
    val Md = 16.dp
    val Lg = 24.dp
    val Xl = 32.dp
}

object DSRadius {
    val Sm = 4.dp
    val Md = 8.dp
    val Lg = 16.dp
    val Full = 9999.dp
}

// ============================================================================
// SURFACE CONTAINER TOKENS (Material 3)
// ============================================================================

object DSSurfaces {
    // Light mode
    val Surface = Color.White
    val SurfaceInverse = Color(0xFF1A1A1A)
    val SurfaceContainerLowest = Color.White
    val SurfaceContainerLow = Color(0xFFF8F5F2)
    val SurfaceContainer = Color(0xFFF1EDE8)
    val SurfaceContainerHigh = Color(0xFFE8E3DC)
    val SurfaceContainerHighest = Color(0xFFDED8CF)
    val SurfaceDim = Color(0xFFE8E3DC)
    val SurfaceBright = Color.White

    // Scrim
    val Scrim = Color.Black.copy(alpha = 0.32f)
    val ScrimLight = Color.Black.copy(alpha = 0.08f)
    val ScrimHeavy = Color.Black.copy(alpha = 0.64f)
}

object DSSurfacesDark {
    val Surface = Color(0xFF1A1A1A)
    val SurfaceInverse = Color.White
    val SurfaceContainerLowest = Color(0xFF0D0D0D)
    val SurfaceContainerLow = Color(0xFF1A1A1A)
    val SurfaceContainer = Color(0xFF252524)
    val SurfaceContainerHigh = Color(0xFF2F2F2E)
    val SurfaceContainerHighest = Color(0xFF3A3A38)
    val SurfaceDim = Color(0xFF1A1A1A)
    val SurfaceBright = Color(0xFF3A3A38)

    val Scrim = Color.Black.copy(alpha = 0.64f)
    val ScrimLight = Color.Black.copy(alpha = 0.32f)
    val ScrimHeavy = Color.Black.copy(alpha = 0.80f)
}

// ============================================================================
// FILL TOKENS
// ============================================================================

object DSFills {
    // Primary
    val Primary = Color(0xFFF96302)
    val PrimaryHover = Color(0xFFE55A02)
    val PrimaryPressed = Color(0xFFCC5002)
    val PrimaryDisabled = Color(0xFFF96302).copy(alpha = 0.38f)

    // Secondary
    val Secondary = Color(0xFF4A8165)
    val SecondaryHover = Color(0xFF3D6B54)
    val SecondaryPressed = Color(0xFF305544)
    val SecondaryDisabled = Color(0xFF4A8165).copy(alpha = 0.38f)

    // Tertiary
    val Tertiary = Color(0xFFA69F94)
    val Neutral = Color(0xFFF1EDE8)

    // Semantic
    val Error = Color(0xFFDF3427)
    val Success = Color(0xFF4A8165)
    val Warning = Color(0xFFCFB73A)
    val Info = Color(0xFF5B8FA8)
}

// ============================================================================
// OUTLINE TOKENS
// ============================================================================

object DSOutlines {
    val Outline = Color(0xFFA69F94)
    val OutlineVariant = Color(0xFFDED8CF)
    val OutlineStrong = Color(0xFF787166)

    val FocusRing = Color(0xFFF96302)
    val FocusRingError = Color(0xFFDF3427)
    val FocusRingSuccess = Color(0xFF4A8165)

    val InputDefault = Color(0xFFA69F94)
    val InputHover = Color(0xFF787166)
    val InputFocused = Color(0xFFF96302)
    val InputError = Color(0xFFDF3427)

    val Divider = Color(0xFFE8E3DC)
    val DividerStrong = Color(0xFFDED8CF)
}

// ============================================================================
// STATE LAYER OPACITIES (Material 3)
// ============================================================================

object DSStateOpacity {
    const val Hover = 0.08f
    const val Focus = 0.12f
    const val Pressed = 0.12f
    const val Dragged = 0.16f
    const val Disabled = 0.38f
}

// ============================================================================
// ELEVATION TONAL OVERLAY (Android Dark Theme)
// ============================================================================

object DSElevationTonalOverlay {
    val Level0 = Color.Transparent
    val Level1 = Color(0xFFF96302).copy(alpha = 0.05f)
    val Level2 = Color(0xFFF96302).copy(alpha = 0.08f)
    val Level3 = Color(0xFFF96302).copy(alpha = 0.11f)
    val Level4 = Color(0xFFF96302).copy(alpha = 0.12f)
    val Level5 = Color(0xFFF96302).copy(alpha = 0.14f)
}

// ============================================================================
// SEMANTIC COLORS
// ============================================================================

data class SemanticColors(
    val primary: Color,
    val secondary: Color,
    val surface: Color,
    val surfaceSecondary: Color,
    val onSurface: Color,
    val onSurfaceSecondary: Color,
    val border: Color,
    val success: Color,
    val successLight: Color,
    val warning: Color,
    val warningLight: Color,
    val error: Color,
    val errorLight: Color,
    val info: Color,
    val infoLight: Color,
)

val LightSemanticColors = SemanticColors(
    primary = DSColors.Brand300,
    secondary = DSColors.Green500,
    surface = Color.White,
    surfaceSecondary = DSColors.Greige050,
    onSurface = DSColors.Greige900,
    onSurfaceSecondary = DSColors.Greige700,
    border = DSColors.Greige200,
    success = DSColors.Green500,
    successLight = DSColors.Green050,
    warning = DSColors.Warning200,
    warningLight = DSColors.Warning050,
    error = DSColors.Error500,
    errorLight = DSColors.Error050,
    info = DSColors.Info500,
    infoLight = DSColors.Info050,
)

val DarkSemanticColors = SemanticColors(
    primary = DSColors.Brand300,
    secondary = DSColors.Green500,
    surface = DSColors.Greige950,
    surfaceSecondary = DSColors.Greige900,
    onSurface = DSColors.Greige050,
    onSurfaceSecondary = DSColors.Greige200,
    border = DSColors.Greige700,
    success = DSColors.Green500,
    successLight = DSColors.Green700,
    warning = DSColors.Warning200,
    warningLight = DSColors.Warning050,
    error = DSColors.Error500,
    errorLight = DSColors.Error050,
    info = DSColors.Info500,
    infoLight = DSColors.Info050,
)

// ============================================================================
// MAIN SHOWCASE COMPOSABLE
// ============================================================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DesignSystemShowcase() {
    val isDark = isSystemInDarkTheme()
    val colors = if (isDark) DarkSemanticColors else LightSemanticColors

    Scaffold(
        topBar = {
            LargeTopAppBar(
                title = {
                    Column {
                        Text(
                            "Design System",
                            fontFamily = DSTypography.FontFamily,
                            fontWeight = FontWeight.SemiBold,
                        )
                        Text(
                            "iOS 18 + Android 15 Reference",
                            fontSize = DSTypography.BodySm,
                            color = colors.onSurfaceSecondary,
                        )
                    }
                },
                colors = TopAppBarDefaults.largeTopAppBarColors(
                    containerColor = colors.surface,
                ),
            )
        },
        containerColor = colors.surface,
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = DSSpacing.Md),
            verticalArrangement = Arrangement.spacedBy(DSSpacing.Xl),
        ) {
            item { HeaderSection(colors) }
            item { ColorsSection(colors) }
            item { SurfacesSection(colors, isDark) }
            item { FillsSection(colors) }
            item { OutlinesSection(colors) }
            item { StatesSection(colors) }
            item { TypographySection(colors) }
            item { ButtonsSection(colors) }
            item { InputsSection(colors) }
            item { CardsSection(colors) }
            item { ListsSection(colors) }
            item { NavigationSection(colors) }
            item { TogglesSection(colors) }
            item { AlertsSection(colors) }
            item { Spacer(modifier = Modifier.height(DSSpacing.Xl)) }
        }
    }
}

// ============================================================================
// HEADER SECTION
// ============================================================================

@Composable
private fun HeaderSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
        // Font info card
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surfaceSecondary, RoundedCornerShape(DSRadius.Lg))
                .padding(DSSpacing.Md),
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Md),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(colors.primary, RoundedCornerShape(DSRadius.Md)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    Icons.Default.TextFormat,
                    contentDescription = null,
                    tint = Color.White,
                )
            }
            Column {
                Text(
                    "Font: Open Sans",
                    fontSize = DSTypography.H6,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.onSurface,
                )
                Text(
                    "Cross-platform Google Font for iOS, Android, and Web",
                    fontSize = DSTypography.BodySm,
                    color = colors.onSurfaceSecondary,
                )
            }
        }

        // Platform badges
        Row(horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
            PlatformBadge("Android 15", colors)
            PlatformBadge("Jetpack Compose", colors)
            PlatformBadge("Material 3", colors)
        }
    }
}

@Composable
private fun PlatformBadge(text: String, colors: SemanticColors) {
    Text(
        text = text,
        fontSize = DSTypography.BodyXs,
        fontWeight = FontWeight.Medium,
        color = colors.onSurfaceSecondary,
        modifier = Modifier
            .background(colors.surfaceSecondary, CircleShape)
            .padding(horizontal = DSSpacing.Sm, vertical = DSSpacing.Xs),
    )
}

// ============================================================================
// COLORS SECTION
// ============================================================================

@Composable
private fun ColorsSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Colors", colors)

        PlatformNote(
            ios = "Use Color assets, supports dark mode via asset catalog",
            android = "Material color system, dynamic colors on Android 12+",
            colors = colors,
        )

        // Brand colors
        Text(
            "Brand (Primary)",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(6),
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.height(80.dp),
        ) {
            items(listOf(
                DSColors.Brand025 to "025",
                DSColors.Brand050 to "050",
                DSColors.Brand100 to "100",
                DSColors.Brand200 to "200",
                DSColors.Brand300 to "300",
                DSColors.Brand400 to "400",
            )) { (color, label) ->
                ColorSwatch(color, label, colors)
            }
        }

        // Neutral colors
        Text(
            "Neutrals",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(6),
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.height(80.dp),
        ) {
            items(listOf(
                DSColors.Greige025 to "025",
                DSColors.Greige050 to "050",
                DSColors.Greige200 to "200",
                DSColors.Greige500 to "500",
                DSColors.Greige700 to "700",
                DSColors.Greige900 to "900",
            )) { (color, label) ->
                ColorSwatch(color, label, colors)
            }
        }
    }
}

@Composable
private fun ColorSwatch(color: Color, label: String, colors: SemanticColors) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(color, RoundedCornerShape(DSRadius.Sm))
                .border(1.dp, colors.border, RoundedCornerShape(DSRadius.Sm)),
        )
        Text(
            label,
            fontSize = 10.sp,
            color = colors.onSurfaceSecondary,
        )
    }
}

// ============================================================================
// SURFACES SECTION
// ============================================================================

@Composable
private fun SurfacesSection(colors: SemanticColors, isDark: Boolean) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Surfaces & Containers", colors)

        PlatformNote(
            ios = "Uses Materials (blur effects) with vibrancy levels for layered UI",
            android = "Uses Surface Container hierarchy with tonal elevation",
            colors = colors,
        )

        // Surface Container Hierarchy
        Text(
            "Surface Container Hierarchy (Material 3)",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.fillMaxWidth(),
        ) {
            listOf(
                (if (isDark) DSSurfacesDark.SurfaceContainerLowest else DSSurfaces.SurfaceContainerLowest) to "Lowest",
                (if (isDark) DSSurfacesDark.SurfaceContainerLow else DSSurfaces.SurfaceContainerLow) to "Low",
                (if (isDark) DSSurfacesDark.SurfaceContainer else DSSurfaces.SurfaceContainer) to "Default",
                (if (isDark) DSSurfacesDark.SurfaceContainerHigh else DSSurfaces.SurfaceContainerHigh) to "High",
                (if (isDark) DSSurfacesDark.SurfaceContainerHighest else DSSurfaces.SurfaceContainerHighest) to "Highest",
            ).forEach { (color, label) ->
                SurfaceSwatch(color, label, colors, Modifier.weight(1f))
            }
        }

        // Brightness Variants
        Text(
            "Brightness Variants",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.fillMaxWidth(),
        ) {
            listOf(
                (if (isDark) DSSurfacesDark.Surface else DSSurfaces.Surface) to "Surface",
                (if (isDark) DSSurfacesDark.SurfaceDim else DSSurfaces.SurfaceDim) to "Dim",
                (if (isDark) DSSurfacesDark.SurfaceBright else DSSurfaces.SurfaceBright) to "Bright",
                (if (isDark) DSSurfacesDark.SurfaceInverse else DSSurfaces.SurfaceInverse) to "Inverse",
            ).forEach { (color, label) ->
                SurfaceSwatch(color, label, colors, Modifier.weight(1f))
            }
        }

        // Scrim & Overlays
        Text(
            "Scrim & Overlays",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.fillMaxWidth(),
        ) {
            listOf(
                (if (isDark) DSSurfacesDark.ScrimLight else DSSurfaces.ScrimLight) to "Light",
                (if (isDark) DSSurfacesDark.Scrim else DSSurfaces.Scrim) to "Default",
                (if (isDark) DSSurfacesDark.ScrimHeavy else DSSurfaces.ScrimHeavy) to "Heavy",
            ).forEach { (color, label) ->
                ScrimSwatch(color, label, colors, Modifier.weight(1f))
            }
        }

        // Elevation Tonal Overlay
        Text(
            "Elevation Tonal Overlay (Dark Theme)",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Text(
            "In dark theme, Material 3 applies a tonal overlay based on primary color to indicate elevation.",
            fontSize = DSTypography.BodyXs,
            color = colors.onSurfaceSecondary,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Xs),
            modifier = Modifier.fillMaxWidth(),
        ) {
            listOf(
                DSElevationTonalOverlay.Level0 to "L0",
                DSElevationTonalOverlay.Level1 to "L1",
                DSElevationTonalOverlay.Level2 to "L2",
                DSElevationTonalOverlay.Level3 to "L3",
                DSElevationTonalOverlay.Level4 to "L4",
                DSElevationTonalOverlay.Level5 to "L5",
            ).forEach { (overlay, label) ->
                ElevationSwatch(overlay, label, colors, Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun SurfaceSwatch(color: Color, label: String, colors: SemanticColors, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(color, RoundedCornerShape(DSRadius.Sm))
                .border(1.dp, colors.border, RoundedCornerShape(DSRadius.Sm)),
        )
        Text(
            label,
            fontSize = 9.sp,
            color = colors.onSurfaceSecondary,
        )
    }
}

@Composable
private fun ScrimSwatch(color: Color, label: String, colors: SemanticColors, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(Color.Gray, RoundedCornerShape(DSRadius.Sm))
                .border(1.dp, colors.border, RoundedCornerShape(DSRadius.Sm)),
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(color, RoundedCornerShape(DSRadius.Sm)),
            )
        }
        Text(
            label,
            fontSize = 10.sp,
            color = colors.onSurfaceSecondary,
        )
    }
}

@Composable
private fun ElevationSwatch(overlay: Color, label: String, colors: SemanticColors, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(Color(0xFF1A1A1A), RoundedCornerShape(DSRadius.Sm))
                .border(1.dp, colors.border, RoundedCornerShape(DSRadius.Sm)),
            contentAlignment = Alignment.Center,
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(overlay, RoundedCornerShape(DSRadius.Sm)),
            )
            Text(
                label,
                fontSize = 10.sp,
                color = Color.White,
            )
        }
    }
}

// ============================================================================
// FILLS SECTION
// ============================================================================

@Composable
private fun FillsSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Fill Roles", colors)

        Text(
            "Fill colors are used for interactive elements like buttons, chips, and filled containers.",
            fontSize = DSTypography.BodySm,
            color = colors.onSurfaceSecondary,
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surfaceSecondary, RoundedCornerShape(DSRadius.Md))
                .padding(DSSpacing.Md),
        )

        // Primary Fills
        Text(
            "Primary",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        FillStatesRow(
            base = DSFills.Primary,
            hover = DSFills.PrimaryHover,
            pressed = DSFills.PrimaryPressed,
            disabled = DSFills.PrimaryDisabled,
            colors = colors,
        )

        // Secondary Fills
        Text(
            "Secondary",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        FillStatesRow(
            base = DSFills.Secondary,
            hover = DSFills.SecondaryHover,
            pressed = DSFills.SecondaryPressed,
            disabled = DSFills.SecondaryDisabled,
            colors = colors,
        )

        // Semantic Fills
        Text(
            "Semantic",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.fillMaxWidth(),
        ) {
            listOf(
                DSFills.Error to "Error",
                DSFills.Success to "Success",
                DSFills.Warning to "Warning",
                DSFills.Info to "Info",
            ).forEach { (color, label) ->
                FillSwatch(color, label, Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun FillStatesRow(
    base: Color,
    hover: Color,
    pressed: Color,
    disabled: Color,
    colors: SemanticColors,
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(DSSpacing.Xs),
        modifier = Modifier.fillMaxWidth(),
    ) {
        listOf(
            base to "Base",
            hover to "Hover",
            pressed to "Press",
            disabled to "Disabled",
        ).forEach { (color, label) ->
            FillSwatch(color, label, Modifier.weight(1f))
        }
    }
}

@Composable
private fun FillSwatch(color: Color, label: String, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(40.dp)
                .background(color, RoundedCornerShape(DSRadius.Sm)),
        )
        Text(
            label,
            fontSize = 9.sp,
            color = Color.Gray,
        )
    }
}

// ============================================================================
// OUTLINES SECTION
// ============================================================================

@Composable
private fun OutlinesSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Outlines & Borders", colors)

        PlatformNote(
            ios = "Prefers minimal borders, uses shadows for depth separation",
            android = "Uses outline and outlineVariant for borders and dividers (Material 3)",
            colors = colors,
        )

        // Standard Outlines
        Text(
            "Standard Outlines",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Column(
            verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surfaceSecondary, RoundedCornerShape(DSRadius.Md))
                .padding(DSSpacing.Md),
        ) {
            OutlineSwatch(DSOutlines.Outline, "Outline", colors)
            OutlineSwatch(DSOutlines.OutlineVariant, "Outline Variant", colors)
            OutlineSwatch(DSOutlines.OutlineStrong, "Outline Strong", colors)
        }

        // Focus Rings
        Text(
            "Focus Rings",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Md),
        ) {
            FocusRingSwatch(DSOutlines.FocusRing, "Default", colors)
            FocusRingSwatch(DSOutlines.FocusRingError, "Error", colors)
            FocusRingSwatch(DSOutlines.FocusRingSuccess, "Success", colors)
        }

        // Input States
        Text(
            "Input Border States",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier.fillMaxWidth(),
        ) {
            listOf(
                DSOutlines.InputDefault to "Default",
                DSOutlines.InputHover to "Hover",
                DSOutlines.InputFocused to "Focused",
                DSOutlines.InputError to "Error",
            ).forEach { (color, label) ->
                InputStateSwatch(color, label, colors, Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun OutlineSwatch(color: Color, label: String, colors: SemanticColors) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .border(2.dp, color, RoundedCornerShape(DSRadius.Sm))
                .background(colors.surface, RoundedCornerShape(DSRadius.Sm)),
        )
        Text(
            label,
            fontSize = DSTypography.BodySm,
            color = colors.onSurface,
        )
    }
}

@Composable
private fun FocusRingSwatch(color: Color, label: String, colors: SemanticColors) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .border(3.dp, color, RoundedCornerShape(DSRadius.Md))
                .background(colors.surface, RoundedCornerShape(DSRadius.Md)),
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            label,
            fontSize = 10.sp,
            color = colors.onSurfaceSecondary,
        )
    }
}

@Composable
private fun InputStateSwatch(color: Color, label: String, colors: SemanticColors, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(36.dp)
                .border(2.dp, color, RoundedCornerShape(DSRadius.Sm))
                .background(colors.surface, RoundedCornerShape(DSRadius.Sm)),
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            label,
            fontSize = 9.sp,
            color = colors.onSurfaceSecondary,
        )
    }
}

// ============================================================================
// STATES SECTION
// ============================================================================

@Composable
private fun StatesSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Interactive States", colors)

        PlatformNote(
            ios = "Uses highlight overlay (10% black/white) for pressed states, system focus rings",
            android = "Uses state layer system with specific opacities (8% hover, 12% focus/pressed, 16% drag)",
            colors = colors,
        )

        // State Layer Opacities
        Text(
            "State Layer Opacities (Material 3)",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surfaceSecondary, RoundedCornerShape(DSRadius.Md))
                .padding(DSSpacing.Md),
        ) {
            listOf(
                DSStateOpacity.Hover to "Hover\n8%",
                DSStateOpacity.Focus to "Focus\n12%",
                DSStateOpacity.Pressed to "Pressed\n12%",
                DSStateOpacity.Dragged to "Dragged\n16%",
                DSStateOpacity.Disabled to "Disabled\n38%",
            ).forEach { (opacity, label) ->
                StateOpacitySwatch(opacity, label, colors, Modifier.weight(1f))
            }
        }

        // Button States
        Text(
            "Button States",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Column(
            verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surfaceSecondary, RoundedCornerShape(DSRadius.Md))
                .padding(DSSpacing.Md),
        ) {
            ButtonStateRow("Enabled", 1f, null, colors)
            ButtonStateRow("Hovered", 1f, DSStateOpacity.Hover, colors)
            ButtonStateRow("Focused", 1f, DSStateOpacity.Focus, colors)
            ButtonStateRow("Pressed", 1f, DSStateOpacity.Pressed, colors)
            ButtonStateRow("Disabled", DSStateOpacity.Disabled, null, colors)
        }

        // Ripple Effect Demo
        Text(
            "Material Ripple Effect (Android)",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp)
                .clip(RoundedCornerShape(DSRadius.Md))
                .background(colors.primary)
                .clickable { },
            contentAlignment = Alignment.Center,
        ) {
            Text(
                "Tap to see ripple",
                fontSize = DSTypography.BodyMd,
                fontWeight = FontWeight.SemiBold,
                color = Color.White,
            )
        }
    }
}

@Composable
private fun StateOpacitySwatch(opacity: Float, label: String, colors: SemanticColors, modifier: Modifier = Modifier) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier,
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(40.dp)
                .background(Color.Black.copy(alpha = opacity), RoundedCornerShape(DSRadius.Sm))
                .border(1.dp, colors.border, RoundedCornerShape(DSRadius.Sm)),
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            label,
            fontSize = 9.sp,
            color = colors.onSurface,
            textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun ButtonStateRow(label: String, baseOpacity: Float, overlayOpacity: Float?, colors: SemanticColors) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
    ) {
        Box(
            modifier = Modifier
                .width(100.dp)
                .height(36.dp)
                .clip(CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            // Base color
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(colors.primary.copy(alpha = baseOpacity)),
            )
            // Overlay
            if (overlayOpacity != null) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = overlayOpacity)),
                )
            }
            Text(
                "Button",
                fontSize = DSTypography.BodySm,
                fontWeight = FontWeight.SemiBold,
                color = Color.White,
            )
        }
        Text(
            label,
            fontSize = DSTypography.BodySm,
            color = colors.onSurfaceSecondary,
        )
    }
}

// ============================================================================
// TYPOGRAPHY SECTION
// ============================================================================

@Composable
private fun TypographySection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Typography", colors)

        Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
            TypographyRow("Hero 1", DSTypography.Hero1, FontWeight.SemiBold, colors)
            TypographyRow("Hero 2", DSTypography.Hero2, FontWeight.SemiBold, colors)
            TypographyRow("Heading 1", DSTypography.H1, FontWeight.SemiBold, colors)
            TypographyRow("Heading 2", DSTypography.H2, FontWeight.SemiBold, colors)
            TypographyRow("Heading 3", DSTypography.H3, FontWeight.SemiBold, colors)
            TypographyRow("Body XL", DSTypography.BodyXl, FontWeight.Normal, colors)
            TypographyRow("Body LG", DSTypography.BodyLg, FontWeight.Normal, colors)
            TypographyRow("Body MD", DSTypography.BodyMd, FontWeight.Normal, colors)
            TypographyRow("Body SM", DSTypography.BodySm, FontWeight.Normal, colors)
            TypographyRow("Body XS", DSTypography.BodyXs, FontWeight.Normal, colors)
        }
    }
}

@Composable
private fun TypographyRow(
    name: String,
    size: androidx.compose.ui.unit.TextUnit,
    weight: FontWeight,
    colors: SemanticColors,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = DSSpacing.Xs),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            name,
            fontSize = size,
            fontWeight = weight,
            color = colors.onSurface,
        )
        Text(
            "${size.value.toInt()}sp",
            fontSize = DSTypography.BodyXs,
            color = colors.onSurfaceSecondary,
        )
    }
}

// ============================================================================
// BUTTONS SECTION
// ============================================================================

@Composable
private fun ButtonsSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Buttons", colors)

        PlatformNote(
            ios = "Pill shape (9999px radius), haptic feedback, scale animation",
            android = "Material ripple effect, elevation on press",
            colors = colors,
        )

        // Variants
        Text(
            "Variants",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
            ) {
                Text("Primary")
            }
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = colors.secondary),
                shape = CircleShape,
            ) {
                Text("Secondary")
            }
            OutlinedButton(
                onClick = {},
                shape = CircleShape,
            ) {
                Text("Outlined")
            }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
            TextButton(onClick = {}) {
                Text("Ghost")
            }
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = colors.error),
                shape = CircleShape,
            ) {
                Text("Danger")
            }
        }

        // Sizes
        Text(
            "Sizes",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
            Button(
                onClick = {},
                modifier = Modifier.height(28.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
                contentPadding = PaddingValues(horizontal = DSSpacing.Md),
            ) {
                Text("Small", fontSize = 12.sp)
            }
            Button(
                onClick = {},
                modifier = Modifier.height(36.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
            ) {
                Text("Medium")
            }
            Button(
                onClick = {},
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
            ) {
                Text("Large")
            }
        }

        // States
        Text(
            "States",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm)) {
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
            ) {
                Text("Default")
            }
            Button(
                onClick = {},
                enabled = false,
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
            ) {
                Text("Disabled")
            }
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = colors.primary),
                shape = CircleShape,
            ) {
                CircularProgressIndicator(
                    modifier = Modifier.size(16.dp),
                    color = Color.White,
                    strokeWidth = 2.dp,
                )
                Spacer(modifier = Modifier.width(DSSpacing.Sm))
                Text("Loading")
            }
        }
    }
}

// ============================================================================
// INPUTS SECTION
// ============================================================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun InputsSection(colors: SemanticColors) {
    var textInput by remember { mutableStateOf("") }
    var passwordInput by remember { mutableStateOf("") }
    var searchInput by remember { mutableStateOf("") }

    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Inputs", colors)

        PlatformNote(
            ios = "Rounded rect style, clear button, native keyboard",
            android = "Outlined/Filled variants, floating label animation",
            colors = colors,
        )

        // Text input
        OutlinedTextField(
            value = textInput,
            onValueChange = { textInput = it },
            label = { Text("Text Input") },
            placeholder = { Text("Enter text...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Md),
        )

        // Password input
        OutlinedTextField(
            value = passwordInput,
            onValueChange = { passwordInput = it },
            label = { Text("Password") },
            placeholder = { Text("Enter password...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Md),
            trailingIcon = {
                Icon(Icons.Default.Visibility, contentDescription = null)
            },
        )

        // Search input
        OutlinedTextField(
            value = searchInput,
            onValueChange = { searchInput = it },
            placeholder = { Text("Search...") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Md),
            leadingIcon = {
                Icon(Icons.Default.Search, contentDescription = null)
            },
        )
    }
}

// ============================================================================
// CARDS SECTION
// ============================================================================

@Composable
private fun CardsSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Cards", colors)

        PlatformNote(
            ios = "Inset grouped style, continuous corners, subtle shadows",
            android = "Material elevation, outlined or filled variants",
            colors = colors,
        )

        // Basic Card
        OutlinedCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Lg),
        ) {
            Column(modifier = Modifier.padding(DSSpacing.Md)) {
                Text(
                    "Card Title",
                    fontSize = DSTypography.H5,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.onSurface,
                )
                Spacer(modifier = Modifier.height(DSSpacing.Xs))
                Text(
                    "This is a basic card with a title and description.",
                    fontSize = DSTypography.BodySm,
                    color = colors.onSurfaceSecondary,
                )
            }
        }

        // Elevated Card
        ElevatedCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Lg),
        ) {
            Column(modifier = Modifier.padding(DSSpacing.Md)) {
                Text(
                    "Elevated Card",
                    fontSize = DSTypography.H5,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.onSurface,
                )
                Spacer(modifier = Modifier.height(DSSpacing.Xs))
                Text(
                    "This card has elevation for visual hierarchy.",
                    fontSize = DSTypography.BodySm,
                    color = colors.onSurfaceSecondary,
                )
            }
        }

        // Card with Image
        ElevatedCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Lg),
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(colors.surfaceSecondary),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    Icons.Default.Image,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = colors.onSurfaceSecondary,
                )
            }
            Column(modifier = Modifier.padding(DSSpacing.Md)) {
                Text(
                    "Image Card",
                    fontSize = DSTypography.H6,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.onSurface,
                )
                Text(
                    "Cards can include images.",
                    fontSize = DSTypography.BodySm,
                    color = colors.onSurfaceSecondary,
                )
            }
        }
    }
}

// ============================================================================
// LISTS SECTION
// ============================================================================

@Composable
private fun ListsSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Lists", colors)

        PlatformNote(
            ios = "Inset grouped style, swipe actions, disclosure indicators",
            android = "Material list items with dividers",
            colors = colors,
        )

        // Simple list
        OutlinedCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Lg),
        ) {
            Column {
                listOf("Item One", "Item Two", "Item Three").forEachIndexed { index, item ->
                    ListItem(
                        headlineContent = {
                            Text(item, color = colors.onSurface)
                        },
                    )
                    if (index < 2) {
                        HorizontalDivider(color = colors.border)
                    }
                }
            }
        }

        // List with icons
        OutlinedCard(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(DSRadius.Lg),
        ) {
            Column {
                listOf(
                    Icons.Default.Folder to "Documents",
                    Icons.Default.Image to "Photos",
                    Icons.Default.MusicNote to "Music",
                ).forEachIndexed { index, (icon, title) ->
                    ListItem(
                        headlineContent = {
                            Text(title, color = colors.onSurface)
                        },
                        leadingContent = {
                            Icon(icon, contentDescription = null, tint = colors.primary)
                        },
                        trailingContent = {
                            Icon(
                                Icons.Default.ChevronRight,
                                contentDescription = null,
                                tint = colors.onSurfaceSecondary,
                            )
                        },
                    )
                    if (index < 2) {
                        HorizontalDivider(color = colors.border)
                    }
                }
            }
        }
    }
}

// ============================================================================
// NAVIGATION SECTION
// ============================================================================

@Composable
private fun NavigationSection(colors: SemanticColors) {
    var selectedTab by remember { mutableStateOf(0) }

    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Navigation", colors)

        PlatformNote(
            ios = "Bottom tab bar (5 max), large title nav, swipe-back gesture",
            android = "Bottom navigation (3-5 items), top app bar",
            colors = colors,
        )

        // Bottom Navigation
        Text(
            "Bottom Navigation",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        NavigationBar(
            containerColor = colors.surface,
            modifier = Modifier
                .clip(RoundedCornerShape(DSRadius.Lg))
                .border(1.dp, colors.border, RoundedCornerShape(DSRadius.Lg)),
        ) {
            listOf(
                Icons.Filled.Home to "Home",
                Icons.Filled.Search to "Search",
                Icons.Filled.ShoppingCart to "Cart",
                Icons.Filled.Person to "Profile",
            ).forEachIndexed { index, (icon, label) ->
                NavigationBarItem(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    icon = { Icon(icon, contentDescription = label) },
                    label = { Text(label) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = colors.primary,
                        selectedTextColor = colors.primary,
                    ),
                )
            }
        }

        // Segmented Button
        Text(
            "Segmented Control",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        var segmentedSelection by remember { mutableStateOf(1) }
        Row(
            modifier = Modifier
                .background(colors.surfaceSecondary, RoundedCornerShape(DSRadius.Md))
                .padding(DSSpacing.Xs),
        ) {
            listOf("Day", "Week", "Month", "Year").forEachIndexed { index, label ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(DSRadius.Sm))
                        .background(
                            if (segmentedSelection == index) colors.surface else Color.Transparent
                        )
                        .clickable { segmentedSelection = index }
                        .padding(horizontal = DSSpacing.Md, vertical = DSSpacing.Sm),
                ) {
                    Text(
                        label,
                        fontSize = DSTypography.BodySm,
                        fontWeight = if (segmentedSelection == index) FontWeight.SemiBold else FontWeight.Normal,
                        color = colors.onSurface,
                    )
                }
            }
        }
    }
}

// ============================================================================
// TOGGLES SECTION
// ============================================================================

@Composable
private fun TogglesSection(colors: SemanticColors) {
    var switch1 by remember { mutableStateOf(true) }
    var switch2 by remember { mutableStateOf(false) }
    var checkbox1 by remember { mutableStateOf(true) }
    var checkbox2 by remember { mutableStateOf(false) }
    var radioSelection by remember { mutableStateOf(0) }

    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Toggles", colors)

        PlatformNote(
            ios = "UISwitch with green on-state, round checkmarks",
            android = "Material Switch, Material Checkbox with ripple",
            colors = colors,
        )

        // Switches
        Text(
            "Switches",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Notifications", color = colors.onSurface)
            Switch(
                checked = switch1,
                onCheckedChange = { switch1 = it },
                colors = SwitchDefaults.colors(checkedTrackColor = colors.primary),
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Dark Mode", color = colors.onSurface)
            Switch(
                checked = switch2,
                onCheckedChange = { switch2 = it },
                colors = SwitchDefaults.colors(checkedTrackColor = colors.primary),
            )
        }

        HorizontalDivider(color = colors.border)

        // Checkboxes
        Text(
            "Checkboxes",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(
                checked = checkbox1,
                onCheckedChange = { checkbox1 = it },
                colors = CheckboxDefaults.colors(checkedColor = colors.primary),
            )
            Text("Remember me", color = colors.onSurface)
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(
                checked = checkbox2,
                onCheckedChange = { checkbox2 = it },
                colors = CheckboxDefaults.colors(checkedColor = colors.primary),
            )
            Text("Subscribe to newsletter", color = colors.onSurface)
        }

        HorizontalDivider(color = colors.border)

        // Radio buttons
        Text(
            "Radio Buttons",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        listOf("Option One", "Option Two", "Option Three").forEachIndexed { index, label ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                RadioButton(
                    selected = radioSelection == index,
                    onClick = { radioSelection = index },
                    colors = RadioButtonDefaults.colors(selectedColor = colors.primary),
                )
                Text(label, color = colors.onSurface)
            }
        }
    }
}

// ============================================================================
// ALERTS SECTION
// ============================================================================

@Composable
private fun AlertsSection(colors: SemanticColors) {
    Column(verticalArrangement = Arrangement.spacedBy(DSSpacing.Md)) {
        SectionHeader("Alerts", colors)

        PlatformNote(
            ios = "Native alerts with stacked buttons, action sheets",
            android = "Material Snackbars, Dialog with side-by-side buttons",
            colors = colors,
        )

        // Success Alert
        AlertBanner(
            icon = Icons.Default.CheckCircle,
            iconColor = colors.success,
            backgroundColor = colors.successLight,
            title = "Success",
            message = "Your changes have been saved.",
            colors = colors,
        )

        // Warning Alert
        AlertBanner(
            icon = Icons.Default.Warning,
            iconColor = colors.warning,
            backgroundColor = colors.warningLight,
            title = "Warning",
            message = "Your session will expire soon.",
            colors = colors,
        )

        // Error Alert
        AlertBanner(
            icon = Icons.Default.Error,
            iconColor = colors.error,
            backgroundColor = colors.errorLight,
            title = "Error",
            message = "Failed to save changes.",
            colors = colors,
        )

        // Info Alert
        AlertBanner(
            icon = Icons.Default.Info,
            iconColor = colors.info,
            backgroundColor = colors.infoLight,
            title = "Information",
            message = "A new version is available.",
            colors = colors,
        )

        // Snackbar
        Text(
            "Snackbar (Android Style)",
            fontSize = DSTypography.BodySm,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.onSurface, RoundedCornerShape(DSRadius.Md))
                .padding(DSSpacing.Md),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                "Message sent successfully",
                fontSize = DSTypography.BodySm,
                color = colors.surface,
            )
            TextButton(onClick = {}) {
                Text(
                    "UNDO",
                    color = colors.primary,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
    }
}

@Composable
private fun AlertBanner(
    icon: ImageVector,
    iconColor: Color,
    backgroundColor: Color,
    title: String,
    message: String,
    colors: SemanticColors,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(DSRadius.Md))
            .background(backgroundColor)
            .padding(start = 0.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Box(
            modifier = Modifier
                .width(4.dp)
                .height(64.dp)
                .background(iconColor),
        )
        Row(
            modifier = Modifier.padding(DSSpacing.Md),
            horizontalArrangement = Arrangement.spacedBy(DSSpacing.Sm),
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier.size(20.dp),
            )
            Column {
                Text(
                    title,
                    fontSize = DSTypography.BodyMd,
                    fontWeight = FontWeight.SemiBold,
                    color = colors.onSurface,
                )
                Text(
                    message,
                    fontSize = DSTypography.BodySm,
                    color = colors.onSurfaceSecondary,
                )
            }
        }
    }
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

@Composable
private fun SectionHeader(title: String, colors: SemanticColors) {
    Column {
        Text(
            title,
            fontSize = DSTypography.H2,
            fontWeight = FontWeight.SemiBold,
            color = colors.onSurface,
        )
        Spacer(modifier = Modifier.height(DSSpacing.Xs))
        Box(
            modifier = Modifier
                .width(60.dp)
                .height(2.dp)
                .background(colors.primary),
        )
    }
}

@Composable
private fun PlatformNote(ios: String, android: String, colors: SemanticColors) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.infoLight, RoundedCornerShape(DSRadius.Md))
            .padding(DSSpacing.Md),
        verticalArrangement = Arrangement.spacedBy(DSSpacing.Xs),
    ) {
        Row {
            Text(
                "iOS: ",
                fontSize = DSTypography.BodySm,
                fontWeight = FontWeight.SemiBold,
                color = colors.onSurfaceSecondary,
            )
            Text(
                ios,
                fontSize = DSTypography.BodySm,
                color = colors.onSurfaceSecondary,
            )
        }
        Row {
            Text(
                "Android: ",
                fontSize = DSTypography.BodySm,
                fontWeight = FontWeight.SemiBold,
                color = colors.onSurfaceSecondary,
            )
            Text(
                android,
                fontSize = DSTypography.BodySm,
                color = colors.onSurfaceSecondary,
            )
        }
    }
}

// ============================================================================
// PREVIEW
// ============================================================================

@Preview(showBackground = true)
@Composable
fun DesignSystemShowcasePreview() {
    MaterialTheme {
        DesignSystemShowcase()
    }
}
