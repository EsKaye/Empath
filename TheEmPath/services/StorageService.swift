import Foundation
import CoreData

protocol StorageServiceProtocol {
    func saveReflection(_ reflection: Reflection) throws
    func fetchReflections() throws -> [Reflection]
    func deleteReflection(_ reflection: Reflection) throws
    func saveInsight(_ insight: Insight) throws
    func fetchInsights() throws -> [Insight]
    func deleteInsight(_ insight: Insight) throws
}

class StorageService: StorageServiceProtocol {
    private let container: NSPersistentContainer
    private let context: NSManagedObjectContext
    
    init() {
        container = NSPersistentContainer(name: "TheEmPath")
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Failed to load Core Data stack: \(error)")
            }
        }
        context = container.viewContext
    }
    
    // MARK: - Reflection Operations
    
    func saveReflection(_ reflection: Reflection) throws {
        let entity = ReflectionEntity(context: context)
        entity.id = reflection.id
        entity.prompt = reflection.prompt
        entity.content = reflection.content
        entity.response = reflection.response
        entity.emotionalState = reflection.emotionalState.rawValue
        entity.timestamp = reflection.timestamp
        
        try context.save()
    }
    
    func fetchReflections() throws -> [Reflection] {
        let request: NSFetchRequest<ReflectionEntity> = ReflectionEntity.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \ReflectionEntity.timestamp, ascending: false)]
        
        let entities = try context.fetch(request)
        return entities.compactMap { entity in
            guard let id = entity.id,
                  let prompt = entity.prompt,
                  let content = entity.content,
                  let response = entity.response,
                  let emotionalStateRaw = entity.emotionalState,
                  let emotionalState = EmotionalState(rawValue: emotionalStateRaw),
                  let timestamp = entity.timestamp else {
                return nil
            }
            
            return Reflection(
                id: id,
                prompt: prompt,
                content: content,
                response: response,
                emotionalState: emotionalState,
                timestamp: timestamp
            )
        }
    }
    
    func deleteReflection(_ reflection: Reflection) throws {
        let request: NSFetchRequest<ReflectionEntity> = ReflectionEntity.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", reflection.id as CVarArg)
        
        let entities = try context.fetch(request)
        entities.forEach { context.delete($0) }
        try context.save()
    }
    
    // MARK: - Insight Operations
    
    func saveInsight(_ insight: Insight) throws {
        let entity = InsightEntity(context: context)
        entity.id = insight.id
        entity.content = insight.content
        entity.emotionalState = insight.emotionalState.rawValue
        entity.timestamp = insight.timestamp
        
        try context.save()
    }
    
    func fetchInsights() throws -> [Insight] {
        let request: NSFetchRequest<InsightEntity> = InsightEntity.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \InsightEntity.timestamp, ascending: false)]
        
        let entities = try context.fetch(request)
        return entities.compactMap { entity in
            guard let id = entity.id,
                  let content = entity.content,
                  let emotionalStateRaw = entity.emotionalState,
                  let emotionalState = EmotionalState(rawValue: emotionalStateRaw),
                  let timestamp = entity.timestamp else {
                return nil
            }
            
            return Insight(
                id: id,
                content: content,
                timestamp: timestamp,
                emotionalState: emotionalState
            )
        }
    }
    
    func deleteInsight(_ insight: Insight) throws {
        let request: NSFetchRequest<InsightEntity> = InsightEntity.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", insight.id as CVarArg)
        
        let entities = try context.fetch(request)
        entities.forEach { context.delete($0) }
        try context.save()
    }
}

// MARK: - Core Data Models
extension StorageService {
    @objc(ReflectionEntity)
    public class ReflectionEntity: NSManagedObject {
        @NSManaged public var id: String?
        @NSManaged public var prompt: String?
        @NSManaged public var content: String?
        @NSManaged public var response: String?
        @NSManaged public var emotionalState: String?
        @NSManaged public var timestamp: Date?
    }
    
    @objc(InsightEntity)
    public class InsightEntity: NSManagedObject {
        @NSManaged public var id: String?
        @NSManaged public var content: String?
        @NSManaged public var emotionalState: String?
        @NSManaged public var timestamp: Date?
    }
}

// MARK: - Error Handling
extension StorageService {
    enum StorageError: LocalizedError {
        case saveError
        case fetchError
        case deleteError
        
        var errorDescription: String? {
            switch self {
            case .saveError:
                return "Failed to save data"
            case .fetchError:
                return "Failed to fetch data"
            case .deleteError:
                return "Failed to delete data"
            }
        }
    }
} 