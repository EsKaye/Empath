import SwiftUI

enum Theme {
    // MARK: - Colors
    static let primary = Color("Primary")
    static let secondary = Color("Secondary")
    static let accent = Color("Accent")
    static let background = Color("Background")
    static let surface = Color("Surface")
    static let text = Color("Text")
    
    // Natural tones
    static let peach = Color(red: 1.0, green: 0.9, blue: 0.85)
    static let violet = Color(red: 0.9, green: 0.85, blue: 1.0)
    static let teal = Color(red: 0.85, green: 0.95, blue: 0.95)
    
    // MARK: - Typography
    enum Typography {
        static let title = Font.system(.title, design: .rounded).weight(.light)
        static let headline = Font.system(.headline, design: .rounded).weight(.medium)
        static let body = Font.system(.body, design: .rounded)
        static let caption = Font.system(.caption, design: .rounded)
    }
    
    // MARK: - Animation
    enum Animation {
        static let spring = SwiftUI.Animation.spring(response: 0.3, dampingFraction: 0.7)
        static let easeOut = SwiftUI.Animation.easeOut(duration: 0.3)
        static let easeInOut = SwiftUI.Animation.easeInOut(duration: 0.3)
    }
    
    // MARK: - Layout
    enum Layout {
        static let cornerRadius: CGFloat = 12
        static let padding: CGFloat = 16
        static let spacing: CGFloat = 8
    }
    
    // MARK: - Shadows
    enum Shadow {
        static let small = Color.black.opacity(0.1)
        static let medium = Color.black.opacity(0.15)
        static let large = Color.black.opacity(0.2)
    }
}

// MARK: - View Modifiers
struct GlowEffect: ViewModifier {
    let color: Color
    let radius: CGFloat
    
    func body(content: Content) -> some View {
        content
            .shadow(color: color.opacity(0.3), radius: radius, x: 0, y: 0)
    }
}

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(Theme.Layout.padding)
            .background(Theme.surface)
            .cornerRadius(Theme.Layout.cornerRadius)
            .shadow(color: Theme.Shadow.small, radius: 5, x: 0, y: 2)
    }
}

// MARK: - View Extensions
extension View {
    func glow(color: Color = Theme.accent, radius: CGFloat = 10) -> some View {
        modifier(GlowEffect(color: color, radius: radius))
    }
    
    func card() -> some View {
        modifier(CardStyle())
    }
}

// MARK: - Voice Support
class VoiceManager: ObservableObject {
    private let synthesizer = AVSpeechSynthesizer()
    
    func speak(_ text: String) {
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = 0.5
        utterance.pitchMultiplier = 1.0
        utterance.volume = 0.8
        
        synthesizer.speak(utterance)
    }
    
    func stop() {
        synthesizer.stopSpeaking(at: .immediate)
    }
} 