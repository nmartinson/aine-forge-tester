export interface Bike {
  id: number
  name: string
  type: 'hardtail' | 'full-suspension' | 'fat-bike' | 'downhill'
  weight: number
  suspension: string
  traction: number
  speed: number
  durability: number
  description: string
  emoji: string
}

export const BIKES: Bike[] = [
  {
    id: 1,
    name: 'Trail Blazer',
    type: 'hardtail',
    weight: 12,
    suspension: 'Front suspension only',
    traction: 70,
    speed: 85,
    durability: 75,
    description: 'Lightweight and responsive. Great for climbing and technical terrain.',
    emoji: '🚲',
  },
  {
    id: 2,
    name: 'All-Terrain Beast',
    type: 'full-suspension',
    weight: 14,
    suspension: 'Full suspension (150mm)',
    traction: 90,
    speed: 75,
    durability: 85,
    description: 'Excellent shock absorption. Perfect for rough descents and rocky trails.',
    emoji: '🚵',
  },
  {
    id: 3,
    name: 'Snow Crusher',
    type: 'fat-bike',
    weight: 16,
    suspension: 'Front suspension',
    traction: 95,
    speed: 60,
    durability: 90,
    description: 'Wide tires for maximum grip. Ideal for extreme terrain and obstacles.',
    emoji: '🛞',
  },
  {
    id: 4,
    name: 'Gravity Master',
    type: 'downhill',
    weight: 15,
    suspension: 'Full suspension (200mm)',
    traction: 85,
    speed: 95,
    durability: 80,
    description: 'Built for speed and control. Dominate steep descents with confidence.',
    emoji: '⚡',
  },
]
