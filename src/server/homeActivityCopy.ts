/** Domain → one short home practice. Never names peers. */

export type HomeCopy = { title: string; instruction: string }

function firstName(name: string) {
  return name.split(/\s+/)[0] || name
}

export function homeCopyForDomain(childName: string, domain: string): HomeCopy {
  const first = firstName(childName)
  const n = domain.toLowerCase()

  if (n.includes('physical') || n.includes('motor')) {
    return {
      title: `Move with ${first}`,
      instruction: `Tonight, play a 5-minute movement game with ${first} — hop, stretch, or carry two cups of water across the room without spilling. Cheer the effort, not speed.`,
    }
  }
  if (n.includes('social') || n.includes('emotional')) {
    return {
      title: `Feelings with ${first}`,
      instruction: `Ask ${first} how school felt (happy / calm / upset). Name the feeling together, then practise one kind act — sharing a toy or saying thank you.`,
    }
  }
  if (n.includes('language') || n.includes('dzo') || n.includes('literacy') || n.includes('communication')) {
    return {
      title: `Words with ${first}`,
      instruction: `Read or tell a 3-minute story with ${first}. Ask one question: “What happened next?” Mix a Dzongkha or English word they already know.`,
    }
  }
  if (n.includes('cognit') || n.includes('knowledge')) {
    return {
      title: `Count & sort with ${first}`,
      instruction: `At dinner, ask ${first} to count 5 spoons or sort 6 stones by colour/size. If they stall, count together — then let them finish.`,
    }
  }
  if (n.includes('cultural') || n.includes('moral') || n.includes('spiritual')) {
    return {
      title: `Kindness with ${first}`,
      instruction: `Practise one Bhutanese courtesy with ${first} — kuzuzangpo, offering a snack first, or a short family prayer/song. Keep it warm, not a test.`,
    }
  }
  return {
    title: `Try again with ${first}`,
    instruction: `Repeat today’s school moment at home for 5 minutes with ${first}. Stay beside them, notice what they try, and stop while it is still fun.`,
  }
}
