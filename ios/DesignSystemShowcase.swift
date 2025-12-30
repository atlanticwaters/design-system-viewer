import SwiftUI

// MARK: - Design System Showcase for iOS 18
// This file demonstrates standard UI components using Open Sans font
// Can be dropped into any iOS project targeting iOS 18+

// MARK: - Design Tokens

enum DSColors {
    // Brand (Primary)
    static let brand025 = Color(hex: "#FFFAF6")
    static let brand050 = Color(hex: "#FEF2E9")
    static let brand100 = Color(hex: "#FEDAC3")
    static let brand200 = Color(hex: "#FBA268")
    static let brand300 = Color(hex: "#F96302") // Primary
    static let brand400 = Color(hex: "#E95C02")
    static let brand500 = Color(hex: "#CA5002")

    // Bottle Green (Secondary/Success)
    static let green025 = Color(hex: "#FAFCFB")
    static let green050 = Color(hex: "#F0F5F3")
    static let green500 = Color(hex: "#4A8165") // Secondary
    static let green700 = Color(hex: "#226242")

    // Greige (Neutral)
    static let greige025 = Color(hex: "#FBFAF9")
    static let greige050 = Color(hex: "#F8F5F2")
    static let greige100 = Color(hex: "#E5E1DE")
    static let greige200 = Color(hex: "#BAB7B4")
    static let greige500 = Color(hex: "#787675")
    static let greige700 = Color(hex: "#585756")
    static let greige900 = Color(hex: "#252524")
    static let greige950 = Color(hex: "#0D0D0D")

    // Cinnabar (Error)
    static let error050 = Color(hex: "#FDF1F0")
    static let error500 = Color(hex: "#DF3427")

    // Lemon (Warning)
    static let warning050 = Color(hex: "#FDF6D2")
    static let warning200 = Color(hex: "#CFB73A")

    // Moonlight (Info)
    static let info050 = Color(hex: "#F3F4F8")
    static let info500 = Color(hex: "#6974A5")
}

enum DSTypography {
    static let fontFamily = "Open Sans"

    // Font sizes
    static let bodyXs: CGFloat = 12
    static let bodySm: CGFloat = 14
    static let bodyMd: CGFloat = 16
    static let bodyLg: CGFloat = 18
    static let bodyXl: CGFloat = 20

    static let h6: CGFloat = 16
    static let h5: CGFloat = 18
    static let h4: CGFloat = 20
    static let h3: CGFloat = 24
    static let h2: CGFloat = 28
    static let h1: CGFloat = 32

    static let hero5: CGFloat = 36
    static let hero4: CGFloat = 40
    static let hero3: CGFloat = 48
    static let hero2: CGFloat = 56
    static let hero1: CGFloat = 64
}

enum DSSpacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
}

enum DSRadius {
    static let sm: CGFloat = 4
    static let md: CGFloat = 8
    static let lg: CGFloat = 16
    static let full: CGFloat = 9999
}

// MARK: - Surface Container Tokens

enum DSSurfaces {
    // Light mode
    static let surface = Color.white
    static let surfaceInverse = Color(hex: "#1A1A1A")
    static let surfaceContainerLowest = Color.white
    static let surfaceContainerLow = Color(hex: "#F8F5F2")
    static let surfaceContainer = Color(hex: "#F1EDE8")
    static let surfaceContainerHigh = Color(hex: "#E8E3DC")
    static let surfaceContainerHighest = Color(hex: "#DED8CF")
    static let surfaceDim = Color(hex: "#E8E3DC")
    static let surfaceBright = Color.white

    // Scrim
    static let scrim = Color.black.opacity(0.32)
    static let scrimLight = Color.black.opacity(0.08)
    static let scrimHeavy = Color.black.opacity(0.64)
}

enum DSSurfacesDark {
    static let surface = Color(hex: "#1A1A1A")
    static let surfaceInverse = Color.white
    static let surfaceContainerLowest = Color(hex: "#0D0D0D")
    static let surfaceContainerLow = Color(hex: "#1A1A1A")
    static let surfaceContainer = Color(hex: "#252524")
    static let surfaceContainerHigh = Color(hex: "#2F2F2E")
    static let surfaceContainerHighest = Color(hex: "#3A3A38")
    static let surfaceDim = Color(hex: "#1A1A1A")
    static let surfaceBright = Color(hex: "#3A3A38")

    static let scrim = Color.black.opacity(0.64)
    static let scrimLight = Color.black.opacity(0.32)
    static let scrimHeavy = Color.black.opacity(0.80)
}

// MARK: - iOS Materials (Blur Effects)

enum DSMaterials {
    struct MaterialConfig {
        let blur: CGFloat
        let saturation: CGFloat
        let opacity: CGFloat
    }

    static let ultraThin = MaterialConfig(blur: 4, saturation: 1.8, opacity: 0.3)
    static let thin = MaterialConfig(blur: 10, saturation: 1.8, opacity: 0.5)
    static let regular = MaterialConfig(blur: 20, saturation: 1.8, opacity: 0.7)
    static let thick = MaterialConfig(blur: 30, saturation: 1.8, opacity: 0.85)
    static let chrome = MaterialConfig(blur: 30, saturation: 1.2, opacity: 0.9)
}

// MARK: - Vibrancy Levels

enum DSVibrancy {
    static let primary: CGFloat = 1.0      // Highest contrast
    static let secondary: CGFloat = 0.7
    static let tertiary: CGFloat = 0.5
    static let quaternary: CGFloat = 0.3   // Lowest contrast
}

// MARK: - Fill Tokens

enum DSFills {
    // Primary
    static let primary = Color(hex: "#F96302")
    static let primaryHover = Color(hex: "#E55A02")
    static let primaryPressed = Color(hex: "#CC5002")
    static let primaryDisabled = Color(hex: "#F96302").opacity(0.38)

    // Secondary
    static let secondary = Color(hex: "#4A8165")
    static let secondaryHover = Color(hex: "#3D6B54")
    static let secondaryPressed = Color(hex: "#305544")
    static let secondaryDisabled = Color(hex: "#4A8165").opacity(0.38)

    // Tertiary
    static let tertiary = Color(hex: "#A69F94")
    static let neutral = Color(hex: "#F1EDE8")

    // Semantic
    static let error = Color(hex: "#DF3427")
    static let success = Color(hex: "#4A8165")
    static let warning = Color(hex: "#CFB73A")
    static let info = Color(hex: "#5B8FA8")
}

// MARK: - Outline Tokens

enum DSOutlines {
    static let outline = Color(hex: "#A69F94")
    static let outlineVariant = Color(hex: "#DED8CF")
    static let outlineStrong = Color(hex: "#787166")

    static let focusRing = Color(hex: "#F96302")
    static let focusRingError = Color(hex: "#DF3427")
    static let focusRingSuccess = Color(hex: "#4A8165")

    static let inputDefault = Color(hex: "#A69F94")
    static let inputHover = Color(hex: "#787166")
    static let inputFocused = Color(hex: "#F96302")
    static let inputError = Color(hex: "#DF3427")

    static let divider = Color(hex: "#E8E3DC")
    static let dividerStrong = Color(hex: "#DED8CF")
}

// MARK: - State Layer Opacities (Material 3)

enum DSStateOpacity {
    static let hover: CGFloat = 0.08
    static let focus: CGFloat = 0.12
    static let pressed: CGFloat = 0.12
    static let dragged: CGFloat = 0.16
    static let disabled: CGFloat = 0.38
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Main Showcase View

struct DesignSystemShowcase: View {
    @Environment(\.colorScheme) private var colorScheme
    @State private var selectedTab = 0

    var isDark: Bool { colorScheme == .dark }

    var surface: Color { isDark ? DSColors.greige950 : .white }
    var surfaceSecondary: Color { isDark ? DSColors.greige900 : DSColors.greige050 }
    var onSurface: Color { isDark ? DSColors.greige050 : DSColors.greige900 }
    var onSurfaceSecondary: Color { isDark ? DSColors.greige200 : DSColors.greige700 }
    var border: Color { isDark ? DSColors.greige700 : DSColors.greige200 }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: DSSpacing.xl) {
                    // Header Info
                    headerSection

                    // Component Sections
                    colorsSection
                    surfacesSection
                    fillsSection
                    outlinesSection
                    statesSection
                    typographySection
                    buttonsSection
                    inputsSection
                    cardsSection
                    listsSection
                    navigationSection
                    togglesSection
                    alertsSection
                }
                .padding(.horizontal, DSSpacing.md)
                .padding(.vertical, DSSpacing.lg)
            }
            .background(surface)
            .navigationTitle("Design System")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            HStack {
                Image(systemName: "textformat")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
                    .frame(width: 40, height: 40)
                    .background(DSColors.brand300)
                    .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))

                VStack(alignment: .leading, spacing: 2) {
                    Text("Font: Open Sans")
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.h6))
                        .fontWeight(.semibold)
                        .foregroundColor(onSurface)
                    Text("Cross-platform Google Font for iOS, Android, and Web")
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                        .foregroundColor(onSurfaceSecondary)
                }
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(surfaceSecondary)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))

            // Platform badges
            HStack(spacing: DSSpacing.sm) {
                platformBadge("iOS 18")
                platformBadge("SwiftUI")
            }
        }
    }

    private func platformBadge(_ text: String) -> some View {
        Text(text)
            .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyXs))
            .fontWeight(.medium)
            .padding(.horizontal, DSSpacing.sm)
            .padding(.vertical, DSSpacing.xs)
            .background(surfaceSecondary)
            .clipShape(Capsule())
            .foregroundColor(onSurfaceSecondary)
    }

    // MARK: - Colors Section

    private var colorsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Colors")

            platformNote(
                "iOS: Use Color assets, supports dark mode via asset catalog",
                "Android: Material color system, dynamic colors on Android 12+"
            )

            Text("Brand (Primary)")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: DSSpacing.sm) {
                colorSwatch(DSColors.brand025, "025")
                colorSwatch(DSColors.brand050, "050")
                colorSwatch(DSColors.brand100, "100")
                colorSwatch(DSColors.brand200, "200")
                colorSwatch(DSColors.brand300, "300")
                colorSwatch(DSColors.brand400, "400")
            }

            Text("Secondary/Success")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: DSSpacing.sm) {
                colorSwatch(DSColors.green025, "025")
                colorSwatch(DSColors.green050, "050")
                colorSwatch(DSColors.green500, "500")
                colorSwatch(DSColors.green700, "700")
            }

            Text("Neutrals")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: DSSpacing.sm) {
                colorSwatch(DSColors.greige025, "025")
                colorSwatch(DSColors.greige050, "050")
                colorSwatch(DSColors.greige200, "200")
                colorSwatch(DSColors.greige500, "500")
                colorSwatch(DSColors.greige700, "700")
                colorSwatch(DSColors.greige900, "900")
            }
        }
    }

    private func colorSwatch(_ color: Color, _ label: String) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(color)
                .frame(height: 48)
                .overlay(
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .stroke(border, lineWidth: 1)
                )
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: 10))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    // MARK: - Surfaces Section

    private var surfacesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Surfaces & Containers")

            platformNote(
                "iOS: Uses Materials (blur effects) with vibrancy levels for layered UI",
                "Android: Uses Surface Container hierarchy with tonal elevation"
            )

            // Surface Container Hierarchy
            Text("Surface Container Hierarchy")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            Text("(Material 3)")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyXs))
                .foregroundColor(onSurfaceSecondary)

            let surfaces = isDark ? DSSurfacesDark.self : DSSurfaces.self
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 5), spacing: DSSpacing.sm) {
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceContainerLowest : DSSurfaces.surfaceContainerLowest, "Lowest")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceContainerLow : DSSurfaces.surfaceContainerLow, "Low")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceContainer : DSSurfaces.surfaceContainer, "Default")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceContainerHigh : DSSurfaces.surfaceContainerHigh, "High")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceContainerHighest : DSSurfaces.surfaceContainerHighest, "Highest")
            }

            // Brightness Variants
            Text("Brightness Variants")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: DSSpacing.sm) {
                surfaceSwatch(isDark ? DSSurfacesDark.surface : DSSurfaces.surface, "Surface")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceDim : DSSurfaces.surfaceDim, "Dim")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceBright : DSSurfaces.surfaceBright, "Bright")
                surfaceSwatch(isDark ? DSSurfacesDark.surfaceInverse : DSSurfaces.surfaceInverse, "Inverse")
            }

            // iOS Materials
            Text("iOS Materials (Blur Effects)")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            VStack(spacing: DSSpacing.sm) {
                materialDemo("Ultra Thin", .ultraThinMaterial)
                materialDemo("Thin", .thinMaterial)
                materialDemo("Regular", .regularMaterial)
                materialDemo("Thick", .thickMaterial)
            }

            // Vibrancy Levels
            Text("Vibrancy Levels (iOS)")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: DSSpacing.sm) {
                vibrancySwatch("Primary", DSVibrancy.primary)
                vibrancySwatch("Secondary", DSVibrancy.secondary)
                vibrancySwatch("Tertiary", DSVibrancy.tertiary)
                vibrancySwatch("Quaternary", DSVibrancy.quaternary)
            }
        }
    }

    private func surfaceSwatch(_ color: Color, _ label: String) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(color)
                .frame(height: 48)
                .overlay(
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .stroke(border, lineWidth: 1)
                )
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: 10))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    private func materialDemo(_ name: String, _ material: Material) -> some View {
        ZStack {
            // Gradient background to show blur effect
            LinearGradient(
                colors: [DSColors.brand300, DSColors.green500, DSColors.warning200],
                startPoint: .leading,
                endPoint: .trailing
            )
            .frame(height: 60)

            // Material overlay
            Rectangle()
                .fill(material)
                .overlay(
                    Text(name)
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                        .fontWeight(.semibold)
                        .foregroundColor(onSurface)
                )
        }
        .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))
    }

    private func vibrancySwatch(_ label: String, _ opacity: CGFloat) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(surfaceSecondary)
                .frame(height: 48)
                .overlay(
                    Text("Aa")
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyLg))
                        .fontWeight(.semibold)
                        .foregroundColor(onSurface)
                        .opacity(opacity)
                )
            Text("\(label): \(Int(opacity * 100))%")
                .font(.custom(DSTypography.fontFamily, size: 10))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    // MARK: - Fills Section

    private var fillsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Fill Roles")

            Text("Fill colors are used for interactive elements like buttons, chips, and filled containers.")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .foregroundColor(onSurfaceSecondary)
                .padding(DSSpacing.md)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(surfaceSecondary)
                .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))

            // Primary Fills
            Text("Primary")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            fillStatesRow(
                base: DSFills.primary,
                hover: DSFills.primaryHover,
                pressed: DSFills.primaryPressed,
                disabled: DSFills.primaryDisabled
            )

            // Secondary Fills
            Text("Secondary")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            fillStatesRow(
                base: DSFills.secondary,
                hover: DSFills.secondaryHover,
                pressed: DSFills.secondaryPressed,
                disabled: DSFills.secondaryDisabled
            )

            // Semantic Fills
            Text("Semantic")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: DSSpacing.sm) {
                fillSwatch(DSFills.error, "Error")
                fillSwatch(DSFills.success, "Success")
                fillSwatch(DSFills.warning, "Warning")
                fillSwatch(DSFills.info, "Info")
            }
        }
    }

    private func fillStatesRow(base: Color, hover: Color, pressed: Color, disabled: Color) -> some View {
        HStack(spacing: DSSpacing.xs) {
            fillStateSwatch(base, "Base")
            fillStateSwatch(hover, "Hover")
            fillStateSwatch(pressed, "Press")
            fillStateSwatch(disabled, "Disabled")
        }
    }

    private func fillStateSwatch(_ color: Color, _ label: String) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(color)
                .frame(height: 40)
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: 9))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    private func fillSwatch(_ color: Color, _ label: String) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(color)
                .frame(height: 40)
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: 10))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    // MARK: - Outlines Section

    private var outlinesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Outlines & Borders")

            platformNote(
                "iOS: Prefers minimal borders, uses shadows for depth separation",
                "Android: Uses outline and outlineVariant for borders and dividers (Material 3)"
            )

            // Standard Outlines
            Text("Standard Outlines")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            VStack(spacing: DSSpacing.sm) {
                outlineSwatch(DSOutlines.outline, "Outline", 2)
                outlineSwatch(DSOutlines.outlineVariant, "Outline Variant", 2)
                outlineSwatch(DSOutlines.outlineStrong, "Outline Strong", 2)
            }
            .padding(DSSpacing.md)
            .background(surfaceSecondary)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))

            // Focus Rings
            Text("Focus Rings")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            HStack(spacing: DSSpacing.md) {
                focusRingSwatch(DSOutlines.focusRing, "Default")
                focusRingSwatch(DSOutlines.focusRingError, "Error")
                focusRingSwatch(DSOutlines.focusRingSuccess, "Success")
            }

            // Input States
            Text("Input Border States")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            HStack(spacing: DSSpacing.sm) {
                inputStateSwatch(DSOutlines.inputDefault, "Default")
                inputStateSwatch(DSOutlines.inputHover, "Hover")
                inputStateSwatch(DSOutlines.inputFocused, "Focused")
                inputStateSwatch(DSOutlines.inputError, "Error")
            }
        }
    }

    private func outlineSwatch(_ color: Color, _ label: String, _ width: CGFloat) -> some View {
        HStack {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .stroke(color, lineWidth: width)
                .frame(width: 40, height: 40)
                .background(surface.clipShape(RoundedRectangle(cornerRadius: DSRadius.sm)))

            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                    .foregroundColor(onSurface)
            }
            Spacer()
        }
    }

    private func focusRingSwatch(_ color: Color, _ label: String) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.md)
                .stroke(color, lineWidth: 3)
                .frame(width: 48, height: 48)
                .background(surface.clipShape(RoundedRectangle(cornerRadius: DSRadius.md)))
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: 10))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    private func inputStateSwatch(_ color: Color, _ label: String) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .stroke(color, lineWidth: 2)
                .frame(height: 36)
                .background(surface.clipShape(RoundedRectangle(cornerRadius: DSRadius.sm)))
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: 9))
                .foregroundColor(onSurfaceSecondary)
        }
    }

    // MARK: - States Section

    private var statesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Interactive States")

            platformNote(
                "iOS: Uses highlight overlay (10% black/white) for pressed states, system focus rings",
                "Android: Uses state layer system with specific opacities (8% hover, 12% focus/pressed, 16% drag)"
            )

            // State Layer Opacities
            Text("State Layer Opacities (Material 3)")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 5), spacing: DSSpacing.sm) {
                stateOpacitySwatch("Hover", DSStateOpacity.hover)
                stateOpacitySwatch("Focus", DSStateOpacity.focus)
                stateOpacitySwatch("Pressed", DSStateOpacity.pressed)
                stateOpacitySwatch("Dragged", DSStateOpacity.dragged)
                stateOpacitySwatch("Disabled", DSStateOpacity.disabled)
            }
            .padding(DSSpacing.md)
            .background(surfaceSecondary)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))

            // Interactive Button States
            Text("Button States")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            VStack(spacing: DSSpacing.sm) {
                buttonStateRow("Enabled", opacity: 1.0, showOverlay: false)
                buttonStateRow("Hovered", opacity: 1.0, showOverlay: true, overlayOpacity: DSStateOpacity.hover)
                buttonStateRow("Focused", opacity: 1.0, showOverlay: true, overlayOpacity: DSStateOpacity.focus)
                buttonStateRow("Pressed", opacity: 1.0, showOverlay: true, overlayOpacity: DSStateOpacity.pressed)
                buttonStateRow("Disabled", opacity: DSStateOpacity.disabled, showOverlay: false)
            }
            .padding(DSSpacing.md)
            .background(surfaceSecondary)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))

            // iOS Highlight Style
            Text("iOS Highlight Style")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            HStack(spacing: DSSpacing.md) {
                VStack(spacing: 4) {
                    RoundedRectangle(cornerRadius: DSRadius.md)
                        .fill(DSColors.brand300)
                        .frame(height: 44)
                        .overlay(
                            Text("Normal")
                                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                                .foregroundColor(.white)
                        )
                    Text("Normal")
                        .font(.custom(DSTypography.fontFamily, size: 10))
                        .foregroundColor(onSurfaceSecondary)
                }

                VStack(spacing: 4) {
                    ZStack {
                        RoundedRectangle(cornerRadius: DSRadius.md)
                            .fill(DSColors.brand300)
                            .frame(height: 44)
                        RoundedRectangle(cornerRadius: DSRadius.md)
                            .fill(Color.black.opacity(0.1))
                            .frame(height: 44)
                        Text("Pressed")
                            .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                            .foregroundColor(.white)
                    }
                    Text("Pressed (10% overlay)")
                        .font(.custom(DSTypography.fontFamily, size: 10))
                        .foregroundColor(onSurfaceSecondary)
                }
            }
        }
    }

    private func stateOpacitySwatch(_ label: String, _ opacity: CGFloat) -> some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(Color.black.opacity(opacity))
                .frame(height: 40)
                .overlay(
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .stroke(border, lineWidth: 1)
                )
            VStack(spacing: 2) {
                Text(label)
                    .font(.custom(DSTypography.fontFamily, size: 10))
                    .foregroundColor(onSurface)
                Text("\(Int(opacity * 100))%")
                    .font(.custom(DSTypography.fontFamily, size: 9))
                    .foregroundColor(onSurfaceSecondary)
            }
        }
    }

    private func buttonStateRow(_ label: String, opacity: CGFloat, showOverlay: Bool, overlayOpacity: CGFloat = 0) -> some View {
        HStack {
            ZStack {
                Capsule()
                    .fill(DSColors.brand300)
                    .frame(width: 100, height: 36)
                    .opacity(opacity)
                if showOverlay {
                    Capsule()
                        .fill(Color.black.opacity(overlayOpacity))
                        .frame(width: 100, height: 36)
                }
                Text("Button")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
            }
            Text(label)
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .foregroundColor(onSurfaceSecondary)
            Spacer()
        }
    }

    // MARK: - Typography Section

    private var typographySection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Typography")

            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                typographyRow("Hero 1", DSTypography.hero1, .semibold)
                typographyRow("Hero 2", DSTypography.hero2, .semibold)
                typographyRow("Heading 1", DSTypography.h1, .semibold)
                typographyRow("Heading 2", DSTypography.h2, .semibold)
                typographyRow("Heading 3", DSTypography.h3, .semibold)
                typographyRow("Body XL", DSTypography.bodyXl, .regular)
                typographyRow("Body LG", DSTypography.bodyLg, .regular)
                typographyRow("Body MD", DSTypography.bodyMd, .regular)
                typographyRow("Body SM", DSTypography.bodySm, .regular)
                typographyRow("Body XS", DSTypography.bodyXs, .regular)
            }
        }
    }

    private func typographyRow(_ name: String, _ size: CGFloat, _ weight: Font.Weight) -> some View {
        HStack {
            Text(name)
                .font(.custom(DSTypography.fontFamily, size: size))
                .fontWeight(weight)
                .foregroundColor(onSurface)
            Spacer()
            Text("\(Int(size))px")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyXs))
                .foregroundColor(onSurfaceSecondary)
        }
        .padding(.vertical, DSSpacing.xs)
    }

    // MARK: - Buttons Section

    private var buttonsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Buttons")

            platformNote(
                "iOS: Pill shape (9999px radius), haptic feedback, scale animation",
                "Android: Material ripple effect, elevation on press"
            )

            Text("Variants")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            HStack(spacing: DSSpacing.sm) {
                dsButton("Primary", style: .primary)
                dsButton("Secondary", style: .secondary)
                dsButton("Outlined", style: .outlined)
            }

            HStack(spacing: DSSpacing.sm) {
                dsButton("Ghost", style: .ghost)
                dsButton("Danger", style: .danger)
            }

            Text("Sizes")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            VStack(spacing: DSSpacing.sm) {
                dsButton("Small", style: .primary, size: .small)
                dsButton("Medium", style: .primary, size: .medium)
                dsButton("Large", style: .primary, size: .large)
            }

            Text("States")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            HStack(spacing: DSSpacing.sm) {
                dsButton("Default", style: .primary)
                dsButton("Disabled", style: .primary, disabled: true)
                dsButton("Loading", style: .primary, loading: true)
            }
        }
    }

    // MARK: - Inputs Section

    @State private var textInput = ""
    @State private var passwordInput = ""
    @State private var searchInput = ""

    private var inputsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Inputs")

            platformNote(
                "iOS: Rounded rect style, clear button, native keyboard",
                "Android: Outlined/Filled variants, floating label animation"
            )

            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Text Input")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyXs))
                    .foregroundColor(onSurfaceSecondary)
                TextField("Enter text...", text: $textInput)
                    .textFieldStyle(.roundedBorder)
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
            }

            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Password")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyXs))
                    .foregroundColor(onSurfaceSecondary)
                SecureField("Enter password...", text: $passwordInput)
                    .textFieldStyle(.roundedBorder)
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
            }

            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Search")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyXs))
                    .foregroundColor(onSurfaceSecondary)
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(onSurfaceSecondary)
                    TextField("Search...", text: $searchInput)
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                }
                .padding(DSSpacing.sm)
                .background(surfaceSecondary)
                .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))
            }
        }
    }

    // MARK: - Cards Section

    private var cardsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Cards")

            platformNote(
                "iOS: Inset grouped style, continuous corners, subtle shadows",
                "Android: Material elevation, outlined or filled variants"
            )

            // Basic Card
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Card Title")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.h5))
                    .fontWeight(.semibold)
                    .foregroundColor(onSurface)
                Text("This is a basic card with a title and description.")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                    .foregroundColor(onSurfaceSecondary)
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(surface)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
            .overlay(
                RoundedRectangle(cornerRadius: DSRadius.lg)
                    .stroke(border, lineWidth: 1)
            )

            // Elevated Card
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Elevated Card")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.h5))
                    .fontWeight(.semibold)
                    .foregroundColor(onSurface)
                Text("This card has a shadow for visual hierarchy.")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                    .foregroundColor(onSurfaceSecondary)
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(surface)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
            .shadow(color: .black.opacity(0.1), radius: 8, y: 4)

            // Card with Image
            VStack(alignment: .leading, spacing: 0) {
                Rectangle()
                    .fill(surfaceSecondary)
                    .frame(height: 120)
                    .overlay(
                        Image(systemName: "photo")
                            .font(.system(size: 32))
                            .foregroundColor(onSurfaceSecondary)
                    )

                VStack(alignment: .leading, spacing: DSSpacing.xs) {
                    Text("Image Card")
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.h6))
                        .fontWeight(.semibold)
                        .foregroundColor(onSurface)
                    Text("Cards can include images.")
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                        .foregroundColor(onSurfaceSecondary)
                }
                .padding(DSSpacing.md)
            }
            .background(surface)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
            .shadow(color: .black.opacity(0.1), radius: 8, y: 4)
        }
    }

    // MARK: - Lists Section

    private var listsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Lists")

            platformNote(
                "iOS: Inset grouped style, swipe actions, disclosure indicators",
                "Android: Material list items with dividers"
            )

            // Simple List
            List {
                ForEach(["Item One", "Item Two", "Item Three"], id: \.self) { item in
                    Text(item)
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                }
            }
            .listStyle(.insetGrouped)
            .frame(height: 180)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))

            // List with icons
            List {
                ForEach([
                    ("folder", "Documents"),
                    ("photo", "Photos"),
                    ("music.note", "Music")
                ], id: \.1) { icon, title in
                    HStack {
                        Image(systemName: icon)
                            .foregroundColor(DSColors.brand300)
                        Text(title)
                            .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                    }
                }
            }
            .listStyle(.insetGrouped)
            .frame(height: 180)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
        }
    }

    // MARK: - Navigation Section

    private var navigationSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Navigation")

            platformNote(
                "iOS: Bottom tab bar (5 max), large title nav, swipe-back gesture",
                "Android: Bottom navigation (3-5 items), top app bar"
            )

            // Tab Bar Preview
            Text("Tab Bar")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            HStack {
                ForEach([
                    ("house", "Home", true),
                    ("magnifyingglass", "Search", false),
                    ("cart", "Cart", false),
                    ("person", "Profile", false)
                ], id: \.1) { icon, label, active in
                    VStack(spacing: 4) {
                        Image(systemName: icon)
                            .font(.system(size: 22))
                        Text(label)
                            .font(.custom(DSTypography.fontFamily, size: 10))
                    }
                    .foregroundColor(active ? DSColors.brand300 : onSurfaceSecondary)
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.vertical, DSSpacing.sm)
            .background(surface)
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
            .overlay(
                RoundedRectangle(cornerRadius: DSRadius.lg)
                    .stroke(border, lineWidth: 1)
            )

            // Segmented Control
            Text("Segmented Control")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)
                .padding(.top, DSSpacing.sm)

            Picker("Time", selection: $selectedTab) {
                Text("Day").tag(0)
                Text("Week").tag(1)
                Text("Month").tag(2)
            }
            .pickerStyle(.segmented)
        }
    }

    // MARK: - Toggles Section

    @State private var toggleOn = true
    @State private var checkboxOn = false
    @State private var radioSelection = 0

    private var togglesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Toggles")

            platformNote(
                "iOS: UISwitch with green on-state, round checkmarks",
                "Android: Material Switch, Material Checkbox with ripple"
            )

            // Toggle
            Toggle(isOn: $toggleOn) {
                Text("Notifications")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                    .foregroundColor(onSurface)
            }
            .tint(DSColors.brand300)

            Toggle(isOn: .constant(false)) {
                Text("Dark Mode")
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                    .foregroundColor(onSurface)
            }
            .tint(DSColors.brand300)

            Divider()

            // Checkbox simulation
            Text("Checkboxes")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            Button {
                checkboxOn.toggle()
            } label: {
                HStack {
                    Image(systemName: checkboxOn ? "checkmark.square.fill" : "square")
                        .foregroundColor(checkboxOn ? DSColors.brand300 : onSurfaceSecondary)
                        .font(.system(size: 22))
                    Text("Remember me")
                        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                        .foregroundColor(onSurface)
                }
            }

            Divider()

            // Radio buttons
            Text("Radio Buttons")
                .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                .fontWeight(.semibold)
                .foregroundColor(onSurface)

            Picker("Options", selection: $radioSelection) {
                Text("Option One").tag(0)
                Text("Option Two").tag(1)
                Text("Option Three").tag(2)
            }
            .pickerStyle(.inline)
            .tint(DSColors.brand300)
        }
    }

    // MARK: - Alerts Section

    private var alertsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            sectionHeader("Alerts")

            platformNote(
                "iOS: Native alerts with stacked buttons, action sheets",
                "Android: Material Snackbars, Dialog with side-by-side buttons"
            )

            // Success Alert
            alertView(
                icon: "checkmark.circle.fill",
                color: DSColors.green500,
                bgColor: DSColors.green050,
                title: "Success",
                message: "Your changes have been saved."
            )

            // Warning Alert
            alertView(
                icon: "exclamationmark.triangle.fill",
                color: DSColors.warning200,
                bgColor: DSColors.warning050,
                title: "Warning",
                message: "Your session will expire soon."
            )

            // Error Alert
            alertView(
                icon: "xmark.circle.fill",
                color: DSColors.error500,
                bgColor: DSColors.error050,
                title: "Error",
                message: "Failed to save changes."
            )

            // Info Alert
            alertView(
                icon: "info.circle.fill",
                color: DSColors.info500,
                bgColor: DSColors.info050,
                title: "Information",
                message: "A new version is available."
            )
        }
    }

    private func alertView(icon: String, color: Color, bgColor: Color, title: String, message: String) -> some View {
        HStack(alignment: .top, spacing: DSSpacing.sm) {
            Image(systemName: icon)
                .foregroundColor(color)
                .font(.system(size: 20))

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodyMd))
                    .fontWeight(.semibold)
                    .foregroundColor(onSurface)
                Text(message)
                    .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
                    .foregroundColor(onSurfaceSecondary)
            }

            Spacer()
        }
        .padding(DSSpacing.md)
        .background(bgColor)
        .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))
        .overlay(
            Rectangle()
                .fill(color)
                .frame(width: 4),
            alignment: .leading
        )
        .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))
    }

    // MARK: - Helper Views

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(.custom(DSTypography.fontFamily, size: DSTypography.h2))
            .fontWeight(.semibold)
            .foregroundColor(onSurface)
            .padding(.bottom, DSSpacing.xs)
            .overlay(
                Rectangle()
                    .fill(DSColors.brand300)
                    .frame(height: 2)
                    .offset(y: 4),
                alignment: .bottom
            )
    }

    private func platformNote(_ ios: String, _ android: String) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            HStack(alignment: .top, spacing: DSSpacing.xs) {
                Text("iOS:")
                    .fontWeight(.semibold)
                Text(ios)
            }
            HStack(alignment: .top, spacing: DSSpacing.xs) {
                Text("Android:")
                    .fontWeight(.semibold)
                Text(android)
            }
        }
        .font(.custom(DSTypography.fontFamily, size: DSTypography.bodySm))
        .foregroundColor(onSurfaceSecondary)
        .padding(DSSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(DSColors.info050)
        .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))
    }

    // MARK: - Button Component

    enum ButtonStyle {
        case primary, secondary, outlined, ghost, danger
    }

    enum ButtonSize {
        case small, medium, large

        var height: CGFloat {
            switch self {
            case .small: return 28
            case .medium: return 36
            case .large: return 44
            }
        }

        var fontSize: CGFloat {
            switch self {
            case .small: return 12
            case .medium, .large: return 14
            }
        }
    }

    @ViewBuilder
    private func dsButton(
        _ label: String,
        style: ButtonStyle,
        size: ButtonSize = .medium,
        disabled: Bool = false,
        loading: Bool = false
    ) -> some View {
        Button {} label: {
            HStack(spacing: DSSpacing.sm) {
                if loading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: buttonForeground(style)))
                        .scaleEffect(0.8)
                }
                Text(label)
                    .font(.custom(DSTypography.fontFamily, size: size.fontSize))
                    .fontWeight(.bold)
            }
            .frame(height: size.height)
            .frame(maxWidth: size == .large ? .infinity : nil)
            .padding(.horizontal, DSSpacing.md)
            .background(buttonBackground(style, disabled: disabled))
            .foregroundColor(buttonForeground(style, disabled: disabled))
            .clipShape(Capsule())
            .overlay(
                Capsule()
                    .stroke(buttonBorder(style), lineWidth: style == .outlined ? 1 : 0)
            )
        }
        .disabled(disabled || loading)
        .opacity(disabled ? 0.5 : 1)
    }

    private func buttonBackground(_ style: ButtonStyle, disabled: Bool = false) -> Color {
        if disabled { return surfaceSecondary }
        switch style {
        case .primary: return DSColors.brand300
        case .secondary: return DSColors.green500
        case .outlined, .ghost: return .clear
        case .danger: return DSColors.error500
        }
    }

    private func buttonForeground(_ style: ButtonStyle, disabled: Bool = false) -> Color {
        if disabled { return onSurfaceSecondary }
        switch style {
        case .primary, .secondary, .danger: return .white
        case .outlined, .ghost: return onSurface
        }
    }

    private func buttonBorder(_ style: ButtonStyle) -> Color {
        style == .outlined ? border : .clear
    }
}

// MARK: - Preview

#Preview {
    DesignSystemShowcase()
}
