import type { Child, Guardian, VoiceScenario } from '../types'

export const CHILDREN_DATA: Child[] = [
  {
    id: 'c1',
    name: 'Tashi Dorji',
    age: '4 yrs 2 mos',
    gender: 'Male',
    village: 'Semtokha, Thimphu',
    avatar: '👦🏻',
    mood: 'Energetic & Curious',
    moodScore: 88,
    lastUpdate: '10 mins ago via Voice Note',
    triggers: ['Noise overload during group play', 'Transition from lunch to naptime'],
    facilitatorTip:
      'Give Tashi a 3-minute warning ring using the traditional bell before changing activities.',
    eldsData: [
      { domain: 'Physical & Motor', score: 85, fullMark: 100 },
      { domain: 'Social & Emotional', score: 65, fullMark: 100 },
      { domain: 'Cognitive', score: 90, fullMark: 100 },
      { domain: 'Language (Dzo/Eng)', score: 75, fullMark: 100 },
      { domain: 'Cultural & Moral', score: 80, fullMark: 100 },
      { domain: 'Approaches to Learning', score: 92, fullMark: 100 },
    ],
    milestones: [
      {
        id: 'm1',
        text: 'Can sing Dzongkha nursery rhyme "Zhey"',
        status: 'Mastered',
        domain: 'Cultural & Moral',
      },
      {
        id: 'm2',
        text: 'Shares wooden building blocks without prompt',
        status: 'Emerging',
        domain: 'Social & Emotional',
      },
      {
        id: 'm3',
        text: 'Hops on one foot for 5 seconds',
        status: 'Proficient',
        domain: 'Physical & Motor',
      },
      {
        id: 'm4',
        text: 'Identifies 5 local Bhutanese flora/fauna',
        status: 'Proficient',
        domain: 'Cognitive',
      },
    ],
    parentUpdates: [
      {
        date: 'Today, 11:30 AM',
        title: 'Great Progress in Dzongkha Vocabulary',
        desc: 'Tashi voluntarily named items in Dzongkha during lunch setup!',
        tag: 'Milestone',
      },
      {
        date: 'Yesterday',
        title: 'Group Play Reflection',
        desc: 'Felt slightly overwhelmed during drum circles, but calmed down after 5 min quiet reading.',
        tag: 'Observation',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Karma Lhamo',
    age: '3 yrs 8 mos',
    gender: 'Female',
    village: 'Dechencholing, Thimphu',
    avatar: '👧🏻',
    mood: 'Gentle & Observant',
    moodScore: 92,
    lastUpdate: '1 hour ago',
    triggers: ['Separation anxiety in the early morning', 'New unfamiliar adult visitors'],
    facilitatorTip:
      'Greet Karma in Dzongkha with her favorite prayer flag doll upon arrival.',
    eldsData: [
      { domain: 'Physical & Motor', score: 70, fullMark: 100 },
      { domain: 'Social & Emotional', score: 88, fullMark: 100 },
      { domain: 'Cognitive', score: 78, fullMark: 100 },
      { domain: 'Language (Dzo/Eng)', score: 95, fullMark: 100 },
      { domain: 'Cultural & Moral', score: 90, fullMark: 100 },
      { domain: 'Approaches to Learning', score: 80, fullMark: 100 },
    ],
    milestones: [
      {
        id: 'm1',
        text: 'Expresses needs clearly in complete sentences',
        status: 'Mastered',
        domain: 'Language (Dzo/Eng)',
      },
      {
        id: 'm2',
        text: 'Folds paper into basic origami shapes (Origami/Pema)',
        status: 'Emerging',
        domain: 'Physical & Motor',
      },
      {
        id: 'm3',
        text: 'Shows empathy when peer drops food',
        status: 'Mastered',
        domain: 'Social & Emotional',
      },
    ],
    parentUpdates: [
      {
        date: 'Today, 9:15 AM',
        title: 'Warm Morning Greeting',
        desc: 'Karma arrived smoothly today with her favorite storybook.',
        tag: 'Wellbeing',
      },
    ],
  },
  {
    id: 'c3',
    name: 'Dechen Wangmo',
    age: '4 yrs 11 mos',
    gender: 'Female',
    village: 'Motithang, Thimphu',
    avatar: '👧🏽',
    mood: 'Creative & Vocal',
    moodScore: 95,
    lastUpdate: '2 hours ago',
    triggers: ['Interruption during painting exercises'],
    facilitatorTip:
      'Encourage Dechen to present her painting to the class during daily circle time.',
    eldsData: [
      { domain: 'Physical & Motor', score: 88, fullMark: 100 },
      { domain: 'Social & Emotional', score: 90, fullMark: 100 },
      { domain: 'Cognitive', score: 85, fullMark: 100 },
      { domain: 'Language (Dzo/Eng)', score: 92, fullMark: 100 },
      { domain: 'Cultural & Moral', score: 94, fullMark: 100 },
      { domain: 'Approaches to Learning', score: 96, fullMark: 100 },
    ],
    milestones: [
      {
        id: 'm1',
        text: 'Counts up to 20 in Dzongkha and English',
        status: 'Mastered',
        domain: 'Cognitive',
      },
      {
        id: 'm2',
        text: 'Demonstrates traditional etiquette (Driglam Namzha basics)',
        status: 'Mastered',
        domain: 'Cultural & Moral',
      },
    ],
    parentUpdates: [
      {
        date: 'Yesterday',
        title: 'Art & Cultural Pride',
        desc: 'Dechen drew an intricate Bhutanese Chorten with high precision.',
        tag: 'Creative',
      },
    ],
  },
  {
    id: 'c4',
    name: 'Kinley Norbu',
    age: '3 yrs 2 mos',
    gender: 'Male',
    village: 'Babesa, Thimphu',
    avatar: ' crit',
    mood: 'Quiet & Contemplative',
    moodScore: 78,
    lastUpdate: '3 hours ago',
    triggers: ['Fast-paced team games', 'Sudden loud instructions'],
    facilitatorTip:
      'Pair Kinley with Karma during outdoor sand activities to build confidence.',
    eldsData: [
      { domain: 'Physical & Motor', score: 65, fullMark: 100 },
      { domain: 'Social & Emotional', score: 60, fullMark: 100 },
      { domain: 'Cognitive', score: 72, fullMark: 100 },
      { domain: 'Language (Dzo/Eng)', score: 68, fullMark: 100 },
      { domain: 'Cultural & Moral', score: 82, fullMark: 100 },
      { domain: 'Approaches to Learning', score: 75, fullMark: 100 },
    ],
    milestones: [
      {
        id: 'm1',
        text: 'Stack 6 blocks without knocking over',
        status: 'Proficient',
        domain: 'Physical & Motor',
      },
      {
        id: 'm2',
        text: 'Responds to own name in Dzongkha',
        status: 'Mastered',
        domain: 'Language (Dzo/Eng)',
      },
    ],
    parentUpdates: [
      {
        date: 'Today, 10:00 AM',
        title: 'Quiet Play Time',
        desc: 'Enjoyed puzzle solving independently for 20 minutes.',
        tag: 'Focus',
      },
    ],
  },
]

export const PRESET_VOICE_SCENARIOS: VoiceScenario[] = [
  {
    title: "Scenario 1: Tashi's Group Play Sharing",
    transcription:
      'Today during morning group activities in Changangkha ECCD center, Tashi Dorji was reluctant to share his wooden blocks with Pema. He got slightly agitated when the noise increased, but when I used the calm hand gesture and spoke soft Dzongkha terms, he paused, took a deep breath, and offered two blocks to Pema.',
    aiAnalysis: {
      child: 'Tashi Dorji',
      domain: 'Social & Emotional Development',
      triggerDetected: 'Group noise overload & resource sharing boundary',
      strategyUsed: 'Calm hand gesture + Soft Dzongkha verbal soothing',
      milestoneHit: 'Shares play materials with peer after soft prompt (Emerging -> Proficient)',
      confidence: '96% match with MoESD ELDS Standard 3.2',
    },
  },
  {
    title: "Scenario 2: Karma's Dzongkha Vocabulary Breakthrough",
    transcription:
      "Karma Lhamo surprised us during the snack time circle! Without any prompt, she pointed at the fruits and named 'Tsho' (apple) and 'Kham' (peach) clearly in Dzongkha, then shared half her piece with Kinley.",
    aiAnalysis: {
      child: 'Karma Lhamo',
      domain: 'Language & Communication / Cultural Values',
      triggerDetected: 'None (Positive Reinforcement)',
      strategyUsed: 'Peer sharing during mealtime routines',
      milestoneHit: 'Spontaneously uses Dzongkha vocabulary for common items (Mastered)',
      confidence: '98% match with MoESD ELDS Standard 4.1',
    },
  },
]

export const CENTER_READINESS_DATA = [
  { domain: 'Physical & Motor', score: 78, target: 80 },
  { domain: 'Social & Emotional', score: 74, target: 80 },
  { domain: 'Cognitive', score: 82, target: 80 },
  { domain: 'Language (Dzo/Eng)', score: 81, target: 80 },
  { domain: 'Cultural & Moral', score: 89, target: 80 },
  { domain: 'Approaches to Learning', score: 86, target: 80 },
]

/** Demo guardians — parent portal is scoped to their linked children only. */
export const GUARDIANS: Guardian[] = [
  {
    id: 'g1',
    name: 'Parent of Tashi',
    childIds: ['c1'],
    telegramUserId: 'demo-telegram-tashi-parent',
  },
  {
    id: 'g2',
    name: 'Parent of Karma',
    childIds: ['c2'],
    telegramUserId: 'demo-telegram-karma-parent',
  },
]

export const DEMO_PARENT_GUARDIAN_ID = 'g1'
