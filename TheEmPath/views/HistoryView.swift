import SwiftUI

struct HistoryView: View {
    @StateObject private var viewModel = ReflectionViewModel()
    @State private var searchText = ""
    @State private var selectedFilter: EmotionalState?
    @Environment(\.dismiss) private var dismiss
    
    @AppStorage("enableAnimations") private var enableAnimations = true
    @AppStorage("enableHaptics") private var enableHaptics = true
    
    private var filteredReflections: [Reflection] {
        viewModel.savedReflections.filter { reflection in
            let matchesSearch = searchText.isEmpty ||
                reflection.content.localizedCaseInsensitiveContains(searchText) ||
                reflection.response.localizedCaseInsensitiveContains(searchText)
            
            let matchesFilter = selectedFilter == nil || reflection.emotionalState == selectedFilter
            
            return matchesSearch && matchesFilter
        }
    }
    
    var body: some View {
        ZStack {
            Theme.background
                .ignoresSafeArea()
            
            VStack(spacing: Theme.Layout.spacing) {
                // Filter Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: Theme.Layout.spacing / 2) {
                        FilterPill(
                            title: "All",
                            isSelected: selectedFilter == nil,
                            action: {
                                if enableHaptics {
                                    let generator = UIImpactFeedbackGenerator(style: .light)
                                    generator.impactOccurred()
                                }
                                selectedFilter = nil
                            }
                        )
                        
                        ForEach(EmotionalState.allCases, id: \.self) { state in
                            FilterPill(
                                title: state.description,
                                color: state.color,
                                isSelected: selectedFilter == state,
                                action: {
                                    if enableHaptics {
                                        let generator = UIImpactFeedbackGenerator(style: .light)
                                        generator.impactOccurred()
                                    }
                                    selectedFilter = state
                                }
                            )
                        }
                    }
                    .padding(.horizontal)
                }
                
                // Search Bar
                SearchBar(text: $searchText)
                    .padding(.horizontal)
                
                if filteredReflections.isEmpty {
                    EmptyStateView()
                } else {
                    // Reflections List
                    ScrollView {
                        LazyVStack(spacing: Theme.Layout.spacing) {
                            ForEach(filteredReflections) { reflection in
                                ReflectionCard(reflection: reflection)
                                    .transition(.opacity.combined(with: .move(edge: .bottom)))
                            }
                        }
                        .padding()
                    }
                }
            }
        }
        .navigationTitle("History")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Done") {
                    if enableHaptics {
                        let generator = UIImpactFeedbackGenerator(style: .medium)
                        generator.impactOccurred()
                    }
                    dismiss()
                }
            }
        }
    }
}

struct FilterPill: View {
    let title: String
    var color: Color = Theme.text
    let isSelected: Bool
    let action: () -> Void
    
    @AppStorage("enableAnimations") private var enableAnimations = true
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(Theme.Typography.caption)
                .foregroundColor(isSelected ? .white : color)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(
                    Capsule()
                        .fill(isSelected ? color : Theme.surface)
                )
                .overlay(
                    Capsule()
                        .stroke(color, lineWidth: isSelected ? 0 : 1)
                )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Theme.text.opacity(0.6))
            
            TextField("Search reflections...", text: $text)
                .textFieldStyle(PlainTextFieldStyle())
                .foregroundColor(Theme.text)
            
            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Theme.text.opacity(0.6))
                }
            }
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(Theme.Layout.cornerRadius)
    }
}

struct ReflectionCard: View {
    let reflection: Reflection
    @State private var isExpanded = false
    
    @AppStorage("enableAnimations") private var enableAnimations = true
    @AppStorage("enableHaptics") private var enableHaptics = true
    
    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Layout.spacing) {
            // Header
            HStack {
                Text(reflection.emotionalState.description)
                    .font(Theme.Typography.caption)
                    .foregroundColor(reflection.emotionalState.color)
                
                Spacer()
                
                Text(reflection.timestamp, style: .time)
                    .font(Theme.Typography.caption)
                    .foregroundColor(Theme.text.opacity(0.6))
            }
            
            // Content
            Text(reflection.content)
                .font(Theme.Typography.body)
                .foregroundColor(Theme.text)
                .lineLimit(isExpanded ? nil : 2)
            
            if !isExpanded {
                Button(action: {
                    if enableHaptics {
                        let generator = UIImpactFeedbackGenerator(style: .light)
                        generator.impactOccurred()
                    }
                    withAnimation(enableAnimations ? .spring(response: 0.3, dampingFraction: 0.7) : nil) {
                        isExpanded = true
                    }
                }) {
                    Text("Read more")
                        .font(Theme.Typography.caption)
                        .foregroundColor(reflection.emotionalState.color)
                }
            }
            
            if isExpanded {
                // Response
                VStack(alignment: .leading, spacing: Theme.Layout.spacing / 2) {
                    Text("Response")
                        .font(Theme.Typography.caption)
                        .foregroundColor(Theme.text.opacity(0.6))
                    
                    Text(reflection.response)
                        .font(Theme.Typography.body)
                        .foregroundColor(Theme.text)
                }
                .padding(.top)
                .transition(.opacity.combined(with: .move(edge: .bottom)))
            }
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(Theme.Layout.cornerRadius)
        .shadow(color: Theme.Shadow.small.color, radius: 5, x: 0, y: 2)
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: Theme.Layout.spacing) {
            Image(systemName: "book.closed")
                .font(.system(size: 50))
                .foregroundColor(Theme.text.opacity(0.6))
            
            Text("No reflections yet")
                .font(Theme.Typography.headline)
                .foregroundColor(Theme.text)
            
            Text("Your reflections will appear here")
                .font(Theme.Typography.caption)
                .foregroundColor(Theme.text.opacity(0.6))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    NavigationView {
        HistoryView()
    }
} 