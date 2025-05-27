import Foundation

struct Reflection: Identifiable, Codable {
    let id: UUID
    let prompt: String
    let content: String
    let response: String
    let emotionalState: EmotionalState
    let timestamp: Date
    var insights: [Insight]
    
    init(
        id: UUID = UUID(),
        prompt: String,
        content: String,
        response: String,
        emotionalState: EmotionalState,
        timestamp: Date = Date(),
        insights: [Insight] = []
    ) {
        self.id = id
        self.prompt = prompt
        self.content = content
        self.response = response
        self.emotionalState = emotionalState
        self.timestamp = timestamp
        self.insights = insights
    }
}

enum EmotionalState: String, Codable, CaseIterable {
    case calm
    case overwhelmed
    case driven
    case broken
    case hopeful
    case confused
    case grateful
    case anxious
    
    var description: String {
        switch self {
        case .calm: return "Feeling centered and peaceful"
        case .overwhelmed: return "Feeling a bit overwhelmed"
        case .driven: return "Feeling motivated and focused"
        case .broken: return "Feeling vulnerable and healing"
        case .hopeful: return "Feeling optimistic and inspired"
        case .confused: return "Seeking clarity and direction"
        case .grateful: return "Feeling thankful and blessed"
        case .anxious: return "Feeling uncertain and seeking peace"
        }
    }
    
    var color: Color {
        switch self {
        case .calm: return Theme.teal
        case .overwhelmed: return Theme.violet
        case .driven: return Theme.peach
        case .broken: return .purple
        case .hopeful: return .green
        case .confused: return .blue
        case .grateful: return .orange
        case .anxious: return .pink
        }
    }
}

struct Insight: Identifiable, Codable {
    let id: UUID
    let content: String
    let timestamp: Date
    let emotionalState: EmotionalState
    
    init(
        id: UUID = UUID(),
        content: String,
        timestamp: Date = Date(),
        emotionalState: EmotionalState
    ) {
        self.id = id
        self.content = content
        self.timestamp = timestamp
        self.emotionalState = emotionalState
    }
} 