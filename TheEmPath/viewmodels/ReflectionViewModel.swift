import Foundation
import Combine

class ReflectionViewModel: ObservableObject {
    @Published var reflectionText = ""
    @Published var isProcessing = false
    @Published var response: String?
    @Published var insights: [Insight] = []
    @Published var error: String?
    @Published var savedReflections: [Reflection] = []
    
    private let emotionalState: EmotionalState
    private let aiService: AIServiceProtocol
    private let storageService: StorageServiceProtocol
    private var cancellables = Set<AnyCancellable>()
    
    init(
        emotionalState: EmotionalState,
        aiService: AIServiceProtocol = AIService(),
        storageService: StorageServiceProtocol = StorageService()
    ) {
        self.emotionalState = emotionalState
        self.aiService = aiService
        self.storageService = storageService
        
        loadSavedReflections()
    }
    
    private func loadSavedReflections() {
        do {
            savedReflections = try storageService.fetchReflections()
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func processReflection() {
        guard !reflectionText.isEmpty else {
            error = ReflectionError.emptyReflection.errorDescription
            return
        }
        
        isProcessing = true
        error = nil
        
        // Generate response
        aiService.generateResponse(for: reflectionText, emotionalState: emotionalState)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    if case .failure(let error) = completion {
                        self?.error = error.localizedDescription
                        self?.isProcessing = false
                    }
                },
                receiveValue: { [weak self] response in
                    self?.response = response
                    self?.generateInsights()
                }
            )
            .store(in: &cancellables)
    }
    
    private func generateInsights() {
        aiService.generateInsights(for: reflectionText, emotionalState: emotionalState)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    if case .failure(let error) = completion {
                        self?.error = error.localizedDescription
                    }
                    self?.isProcessing = false
                },
                receiveValue: { [weak self] insights in
                    self?.insights = insights
                    self?.saveReflection()
                }
            )
            .store(in: &cancellables)
    }
    
    private func saveReflection() {
        guard let response = response else { return }
        
        let reflection = Reflection(
            id: UUID().uuidString,
            prompt: "What's on your mind?",
            content: reflectionText,
            response: response,
            emotionalState: emotionalState,
            timestamp: Date()
        )
        
        do {
            try storageService.saveReflection(reflection)
            savedReflections.insert(reflection, at: 0)
            
            // Save insights
            for insight in insights {
                try storageService.saveInsight(insight)
            }
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func deleteReflection(_ reflection: Reflection) {
        do {
            try storageService.deleteReflection(reflection)
            savedReflections.removeAll { $0.id == reflection.id }
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func clearReflection() {
        reflectionText = ""
        response = nil
        insights = []
        error = nil
    }
}

// MARK: - Error Handling
extension ReflectionViewModel {
    enum ReflectionError: LocalizedError {
        case emptyReflection
        case processingError
        case networkError
        
        var errorDescription: String? {
            switch self {
            case .emptyReflection:
                return "Please share your thoughts before processing"
            case .processingError:
                return "Unable to process reflection at this time"
            case .networkError:
                return "Please check your internet connection"
            }
        }
    }
} 