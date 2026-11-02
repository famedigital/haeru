export type Persona = 'facilitator' | 'parent' | 'director'
export type FacilitatorTab = 'voice-hub' | 'children' | 'copilot' | 'rubric'
export type ObservationSource = 'voice' | 'photo' | 'cctv'
export type MomentStatus = 'pending' | 'confirmed' | 'delivered'

export interface EldsDomainScore {
  domain: string
  score: number
  fullMark: number
}

export interface Milestone {
  id: string
  text: string
  status: string
  domain: string
}

export interface ParentUpdate {
  date: string
  title: string
  desc: string
  tag: string
}

export interface Child {
  id: string
  name: string
  age: string
  gender: string
  village: string
  avatar: string
  mood: string
  moodScore: number
  lastUpdate: string
  triggers: string[]
  facilitatorTip: string
  eldsData: EldsDomainScore[]
  milestones: Milestone[]
  parentUpdates: ParentUpdate[]
}

export interface AiAnalysis {
  child: string
  domain: string
  triggerDetected: string
  strategyUsed: string
  milestoneHit: string
  confidence: string
}

export interface VoiceScenario {
  title: string
  transcription: string
  aiAnalysis: AiAnalysis
}

export interface Guardian {
  id: string
  name: string
  childIds: string[]
  telegramUserId?: string
}

export interface HermesObservationPayload {
  childId: string
  childName: string
  domain: string
  trigger: string
  strategy: string
  milestone: string
  confidence: string
  source: ObservationSource
  transcription?: string
  parentSafeTitle?: string
  parentSafeDesc?: string
  rawRef?: string
}

export interface Observation extends HermesObservationPayload {
  id: string
  createdAt: string
}

export interface Moment {
  id: string
  observationId: string
  childId: string
  title: string
  desc: string
  tag: string
  status: MomentStatus
  createdAt: string
  confirmedAt?: string
  deliveredAt?: string
  mediaUrls?: string[]
  telegramSimulated?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}
