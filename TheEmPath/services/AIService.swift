import Foundation
import Combine

protocol AIServiceProtocol {
    func generateResponse(for reflection: String, emotionalState: EmotionalState) -> AnyPublisher<String, Error>
    func generateInsights(for reflection: String, emotionalState: EmotionalState) -> AnyPublisher<[Insight], Error>
}

class AIService: AIServiceProtocol {
    private let baseURL = "https://api.theempath.app/v1" // TODO: Replace with actual API endpoint
    private let session: URLSession
    
    init(session: URLSession = .shared) {
        self.session = session
    }
    
    func generateResponse(for reflection: String, emotionalState: EmotionalState) -> AnyPublisher<String, Error> {
        // TODO: Replace with actual API call
        return Future<String, Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                let responses = [
                    "I hear you. Your feelings are valid and important. Let's explore this together...",
                    "Thank you for sharing that. It takes courage to be vulnerable. What else comes to mind?",
                    "I understand. This is a safe space to express yourself. Would you like to explore this further?",
                    "Your perspective is valuable. Let's reflect on what this means for you...",
                    "I appreciate you sharing this. How does this make you feel in your body?"
                ]
                
                promise(.success(responses.randomElement() ?? responses[0]))
            }
        }
        .eraseToAnyPublisher()
    }
    
    func generateInsights(for reflection: String, emotionalState: EmotionalState) -> AnyPublisher<[Insight], Error> {
        // TODO: Replace with actual API call
        return Future<[Insight], Error> { promise in
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                let possibleInsights = [
                    "You're showing great self-awareness",
                    "This pattern often leads to growth",
                    "Consider journaling about this regularly",
                    "Notice how your body responds to these thoughts",
                    "This emotion might be protecting you from something",
                    "You're not alone in feeling this way",
                    "This could be an opportunity for healing",
                    "Your feelings are messengers, not masters"
                ]
                
                let insights = (0..<3).map { _ in
                    Insight(
                        content: possibleInsights.randomElement() ?? possibleInsights[0],
                        emotionalState: emotionalState
                    )
                }
                
                promise(.success(insights))
            }
        }
        .eraseToAnyPublisher()
    }
}

// MARK: - Error Handling
extension AIService {
    enum AIServiceError: LocalizedError {
        case invalidResponse
        case networkError
        case decodingError
        
        var errorDescription: String? {
            switch self {
            case .invalidResponse:
                return "Received invalid response from server"
            case .networkError:
                return "Network connection error"
            case .decodingError:
                return "Error processing server response"
            }
        }
    }
}

// MARK: - API Models
extension AIService {
    struct APIResponse: Codable {
        let response: String
        let insights: [String]
    }
    
    struct APIRequest: Codable {
        let reflection: String
        let emotionalState: String
    }
} 