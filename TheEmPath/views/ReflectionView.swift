import SwiftUI

struct ReflectionView: View {
    @EnvironmentObject private var voiceManager: VoiceManager
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel: ReflectionViewModel
    @State private var showResponse = false
    @State private var showInsights = false
    
    @AppStorage("enableAnimations") private var enableAnimations = true
    @AppStorage("enableHaptics") private var enableHaptics = true
    
    init(prompt: String, emotionalState: EmotionalState) {
        _viewModel = StateObject(wrappedValue: ReflectionViewModel(prompt: prompt, emotionalState: emotionalState))
    }
    
    var body: some View {
        ZStack {
            Theme.background
                .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: Theme.Layout.spacing) {
                    // Header
                    VStack(spacing: Theme.Layout.spacing / 2) {
                        Text(viewModel.prompt)
                            .font(Theme.Typography.headline)
                            .multilineTextAlignment(.center)
                            .foregroundColor(Theme.text)
                            .padding(.horizontal)
                        
                        Text(viewModel.emotionalState.description)
                            .font(Theme.Typography.caption)
                            .foregroundColor(viewModel.emotionalState.color)
                    }
                    .padding(.top)
                    
                    // Response
                    if showResponse {
                        VStack(alignment: .leading, spacing: Theme.Layout.spacing) {
                            Text("Response")
                                .font(Theme.Typography.headline)
                                .foregroundColor(Theme.text)
                            
                            Text(viewModel.response)
                                .font(Theme.Typography.body)
                                .foregroundColor(Theme.text)
                                .padding()
                                .background(Theme.surface)
                                .cornerRadius(Theme.Layout.cornerRadius)
                                .shadow(color: Theme.Shadow.small.color, radius: 5, x: 0, y: 2)
                        }
                        .padding(.horizontal)
                        .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }
                    
                    // Insights
                    if showInsights {
                        VStack(alignment: .leading, spacing: Theme.Layout.spacing) {
                            Text("Insights")
                                .font(Theme.Typography.headline)
                                .foregroundColor(Theme.text)
                            
                            ForEach(viewModel.insights) { insight in
                                InsightCard(insight: insight)
                            }
                        }
                        .padding(.horizontal)
                        .transition(.opacity.combined(with: .move(edge: .bottom)))
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    if enableHaptics {
                        let generator = UIImpactFeedbackGenerator(style: .medium)
                        generator.impactOccurred()
                    }
                    dismiss()
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Theme.text.opacity(0.6))
                }
            }
        }
        .onAppear {
            if enableAnimations {
                withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                    showResponse = true
                }
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                        showInsights = true
                    }
                }
            } else {
                showResponse = true
                showInsights = true
            }
            
            if voiceManager.isSpeaking {
                voiceManager.stop()
            }
            voiceManager.speak(viewModel.response)
        }
    }
}

struct InsightCard: View {
    let insight: Insight
    
    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Layout.spacing / 2) {
            Text(insight.content)
                .font(Theme.Typography.body)
                .foregroundColor(Theme.text)
            
            HStack {
                Text(insight.timestamp, style: .time)
                    .font(Theme.Typography.caption)
                    .foregroundColor(Theme.text.opacity(0.6))
                
                Spacer()
                
                Text(insight.emotionalState.description)
                    .font(Theme.Typography.caption)
                    .foregroundColor(insight.emotionalState.color)
            }
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(Theme.Layout.cornerRadius)
        .shadow(color: Theme.Shadow.small.color, radius: 5, x: 0, y: 2)
    }
}

#Preview {
    ReflectionView(prompt: "What's on your mind right now?", emotionalState: .calm)
        .environmentObject(VoiceManager())
} 