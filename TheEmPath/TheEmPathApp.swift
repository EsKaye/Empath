import SwiftUI

@main
struct TheEmPathApp: App {
    @StateObject private var voiceManager = VoiceManager()
    
    var body: some Scene {
        WindowGroup {
            WelcomeView()
                .environmentObject(voiceManager)
                .preferredColorScheme(.light) // Force light mode for consistent experience
        }
    }
}

// MARK: - Environment Objects
class VoiceManager: ObservableObject {
    private let synthesizer = AVSpeechSynthesizer()
    @Published var isSpeaking = false
    
    @AppStorage("enableVoice") private var enableVoice = true
    @AppStorage("voiceRate") private var voiceRate = 0.5
    @AppStorage("voicePitch") private var voicePitch = 1.0
    @AppStorage("voiceVolume") private var voiceVolume = 0.8
    
    func speak(_ text: String) {
        guard enableVoice else { return }
        
        let utterance = AVSpeechUtterance(string: text)
        utterance.rate = Float(voiceRate)
        utterance.pitchMultiplier = Float(voicePitch)
        utterance.volume = Float(voiceVolume)
        
        synthesizer.speak(utterance)
        isSpeaking = true
    }
    
    func stop() {
        synthesizer.stopSpeaking(at: .immediate)
        isSpeaking = false
    }
}

// MARK: - View Extensions
extension View {
    func glow(color: Color = .accentColor, radius: CGFloat = 20) -> some View {
        self
            .shadow(color: color.opacity(0.5), radius: radius / 2)
            .shadow(color: color.opacity(0.3), radius: radius)
    }
} 