import SwiftUI

struct WelcomeView: View {
    @StateObject private var viewModel = EmotionalStateViewModel()
    @State private var showReflection = false
    @State private var showHistory = false
    @State private var showSettings = false
    @State private var selectedPrompt: String?
    @State private var selectedEmotionalState: EmotionalState?
    
    @AppStorage("enableAnimations") private var enableAnimations = true
    @AppStorage("enableHaptics") private var enableHaptics = true
    
    private let prompts: [String] = [
        "What's on your mind right now?",
        "How does this feeling manifest in your body?",
        "What triggered this emotion?",
        "What would help you feel more at peace?",
        "What's one small step you could take today?"
    ]
    
    var body: some View {
        NavigationView {
            ZStack {
                Theme.background
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: Theme.Layout.spacing * 2) {
                        // Header
                        HStack {
                            Button(action: {
                                if enableHaptics {
                                    let generator = UIImpactFeedbackGenerator(style: .medium)
                                    generator.impactOccurred()
                                }
                                showHistory = true
                            }) {
                                Image(systemName: "clock")
                                    .font(.title2)
                                    .foregroundColor(Theme.text.opacity(0.6))
                            }
                            
                            Spacer()
                            
                            Button(action: {
                                if enableHaptics {
                                    let generator = UIImpactFeedbackGenerator(style: .medium)
                                    generator.impactOccurred()
                                }
                                showSettings = true
                            }) {
                                Image(systemName: "gearshape")
                                    .font(.title2)
                                    .foregroundColor(Theme.text.opacity(0.6))
                            }
                        }
                        .padding()
                        
                        // Title
                        Text("TheEmPath")
                            .font(Theme.Typography.title)
                            .foregroundColor(Theme.text)
                            .padding(.top)
                        
                        // Emotional States
                        VStack(spacing: Theme.Layout.spacing) {
                            Text("How are you feeling?")
                                .font(Theme.Typography.headline)
                                .foregroundColor(Theme.text)
                            
                            LazyVGrid(columns: [
                                GridItem(.flexible()),
                                GridItem(.flexible())
                            ], spacing: Theme.Layout.spacing) {
                                ForEach(EmotionalState.allCases, id: \.self) { state in
                                    EmotionalStateButton(
                                        state: state,
                                        isSelected: viewModel.selectedState == state,
                                        action: {
                                            if enableHaptics {
                                                let generator = UIImpactFeedbackGenerator(style: .light)
                                                generator.impactOccurred()
                                            }
                                            viewModel.selectState(state)
                                            selectedPrompt = prompts.randomElement()
                                            selectedEmotionalState = state
                                            showReflection = true
                                        }
                                    )
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showReflection) {
                if let prompt = selectedPrompt,
                   let state = selectedEmotionalState {
                    NavigationView {
                        ReflectionView(prompt: prompt, emotionalState: state)
                    }
                }
            }
            .sheet(isPresented: $showHistory) {
                NavigationView {
                    HistoryView()
                }
            }
            .sheet(isPresented: $showSettings) {
                NavigationView {
                    SettingsView()
                }
            }
        }
    }
}

struct EmotionalStateButton: View {
    let state: EmotionalState
    let isSelected: Bool
    let action: () -> Void
    
    @AppStorage("enableAnimations") private var enableAnimations = true
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: Theme.Layout.spacing / 2) {
                Image(systemName: state.icon)
                    .font(.title)
                    .foregroundColor(isSelected ? .white : state.color)
                
                Text(state.description)
                    .font(Theme.Typography.caption)
                    .foregroundColor(isSelected ? .white : state.color)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(
                RoundedRectangle(cornerRadius: Theme.Layout.cornerRadius)
                    .fill(isSelected ? state.color : Theme.surface)
                    .shadow(color: state.color.opacity(0.2), radius: 5)
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct ScaleButtonStyle: ButtonStyle {
    @AppStorage("enableAnimations") private var enableAnimations = true
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed && enableAnimations ? 0.95 : 1)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: configuration.isPressed)
    }
}

#Preview {
    WelcomeView()
        .environmentObject(VoiceManager())
} 