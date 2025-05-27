import SwiftUI

struct SettingsView: View {
    @AppStorage("enableVoice") private var enableVoice = true
    @AppStorage("voiceRate") private var voiceRate = 0.5
    @AppStorage("voicePitch") private var voicePitch = 1.0
    @AppStorage("voiceVolume") private var voiceVolume = 0.8
    @AppStorage("enableAnimations") private var enableAnimations = true
    @AppStorage("enableHaptics") private var enableHaptics = true
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ZStack {
                Theme.background
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: Theme.Layout.spacing * 2) {
                        // Voice Settings
                        SettingsSection(title: "Voice") {
                            Toggle("Enable Voice", isOn: $enableVoice)
                            
                            if enableVoice {
                                VStack(alignment: .leading, spacing: Theme.Layout.spacing) {
                                    Text("Speech Rate")
                                        .font(Theme.Typography.caption)
                                        .foregroundColor(Theme.text.opacity(0.6))
                                    
                                    Slider(value: $voiceRate, in: 0.1...1.0) {
                                        Text("Speech Rate")
                                    }
                                    .tint(Theme.primary)
                                    
                                    Text("Pitch")
                                        .font(Theme.Typography.caption)
                                        .foregroundColor(Theme.text.opacity(0.6))
                                    
                                    Slider(value: $voicePitch, in: 0.5...2.0) {
                                        Text("Pitch")
                                    }
                                    .tint(Theme.primary)
                                    
                                    Text("Volume")
                                        .font(Theme.Typography.caption)
                                        .foregroundColor(Theme.text.opacity(0.6))
                                    
                                    Slider(value: $voiceVolume, in: 0.0...1.0) {
                                        Text("Volume")
                                    }
                                    .tint(Theme.primary)
                                }
                                .padding(.leading)
                            }
                        }
                        
                        // Animation Settings
                        SettingsSection(title: "Animations") {
                            Toggle("Enable Animations", isOn: $enableAnimations)
                        }
                        
                        // Haptic Settings
                        SettingsSection(title: "Haptics") {
                            Toggle("Enable Haptics", isOn: $enableHaptics)
                        }
                        
                        // About Section
                        SettingsSection(title: "About") {
                            VStack(alignment: .leading, spacing: Theme.Layout.spacing) {
                                Text("TheEmPath")
                                    .font(Theme.Typography.headline)
                                    .foregroundColor(Theme.text)
                                
                                Text("Version 1.0.0")
                                    .font(Theme.Typography.caption)
                                    .foregroundColor(Theme.text.opacity(0.6))
                                
                                Text("A gentle, emotionally intelligent mentor app focused on clarity, purpose, and self-guidance.")
                                    .font(Theme.Typography.body)
                                    .foregroundColor(Theme.text.opacity(0.8))
                                    .padding(.top, 4)
                            }
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct SettingsSection<Content: View>: View {
    let title: String
    let content: Content
    
    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Layout.spacing) {
            Text(title)
                .font(Theme.Typography.headline)
                .foregroundColor(Theme.text)
            
            content
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: Theme.Layout.cornerRadius)
                        .fill(Theme.surface)
                )
        }
    }
}

#Preview {
    SettingsView()
} 