import { Phone, MessageSquare, Heart, ExternalLink } from 'lucide-react'

const CrisisResources = () => {
  const resources = [
    {
      icon: Phone,
      name: "National Crisis Helpline",
      contact: "1-800 891 4416",
      available: "24/7"
    },
    {
      icon: MessageSquare,
      name: "Crisis Text Line",
      contact: " +91-8376804102",
      available: "24/7"
    },
    {
      icon: Heart,
      name: "Suicide Prevention Lifeline",
      contact: "7893078930",
      available: "24/7"
    }
  ]

  return (
    <div className="bg-red-50 rounded-xl p-4">
      <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
        Crisis Resources
        <ExternalLink className="h-4 w-4" />
      </h3>
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <a
            key={index}
            
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-100 transition-colors"
          >
            <resource.icon className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium">{resource.name}</p>
              <p className="text-sm text-gray-600">
                {resource.contact} • Available {resource.available}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default CrisisResources