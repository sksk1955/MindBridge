import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Heart, ThumbsUp } from 'lucide-react'

interface MoodOption {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string>('')

  const moods: MoodOption[] = [
    { icon: Heart, label: 'Great', value: 'great', color: 'text-green-500' },
    { icon: ThumbsUp, label: 'Good', value: 'good', color: 'text-blue-500' },
    { icon: Smile, label: 'Okay', value: 'okay', color: 'text-yellow-500' },
    { icon: Meh, label: 'Meh', value: 'meh', color: 'text-orange-500' },
    { icon: Frown, label: 'Not Good', value: 'not_good', color: 'text-red-500' },
  ]

  return (
    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-3">How are you feeling today?</h3>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => {
          const Icon = mood.icon
          return (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                selectedMood === mood.value ? 'bg-mindwell text-white' : ''
              }`}
              onClick={() => setSelectedMood(mood.value)}
            >
              <Icon className={`h-4 w-4 ${mood.color}`} />
              {mood.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default MoodTracker