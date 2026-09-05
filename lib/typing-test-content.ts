// Content for the Typing Test app. English only for v1 (see D-133 discussion —
// Bengali content is a deliberate fast-follow, not forgotten). Word list is an
// original common-word pool (comparable in spirit to any typing-test's word
// bank, not copied from one) — plain, short, everyday English words, nothing
// obscure. Quote bank is original practice prose written for this app, not
// real attributed quotes — avoids any misattribution/copyright risk entirely,
// and lets every length band (short/medium/long) be tuned on purpose.

export const WORD_LIST = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'is', 'water', 'long', 'find', 'here', 'thing', 'great', 'man', 'world', 'life',
  'still', 'hand', 'high', 'right', 'old', 'too', 'mean', 'same', 'tell', 'boy', 'follow', 'came', 'show',
  'around', 'form', 'three', 'small', 'set', 'put', 'end', 'why', 'again', 'turn', 'here', 'off', 'went',
  'need', 'house', 'picture', 'try', 'kind', 'hand', 'story', 'add', 'even', 'land', 'here', 'must',
  'big', 'such', 'because', 'own', 'under', 'name', 'very', 'through', 'just', 'part', 'sentence', 'eye',
  'place', 'made', 'live', 'where', 'after', 'back', 'little', 'only', 'round', 'man', 'year', 'came',
  'show', 'every', 'good', 'me', 'give', 'our', 'under', 'name', 'very', 'through', 'just', 'form',
  'sentence', 'great', 'think', 'say', 'help', 'low', 'line', 'differ', 'turn', 'cause', 'much', 'mean',
  'before', 'move', 'right', 'boy', 'old', 'too', 'same', 'tell', 'does', 'set', 'three', 'want', 'air',
  'well', 'also', 'play', 'small', 'end', 'put', 'home', 'read', 'hand', 'port', 'large', 'spell', 'add',
  'even', 'land', 'here', 'must', 'big', 'high', 'such', 'follow', 'act', 'why', 'ask', 'men', 'change',
  'went', 'light', 'kind', 'off', 'need', 'house', 'picture', 'try', 'us', 'again', 'animal', 'point',
  'mother', 'world', 'near', 'build', 'self', 'earth', 'father', 'head', 'stand', 'own', 'page', 'should',
  'country', 'found', 'answer', 'school', 'grow', 'study', 'still', 'learn', 'plant', 'cover', 'food',
  'sun', 'four', 'between', 'state', 'keep', 'eye', 'never', 'last', 'let', 'thought', 'city', 'tree',
  'cross', 'farm', 'hard', 'start', 'might', 'story', 'saw', 'far', 'sea', 'draw', 'left', 'late', 'run',
  'while', 'press', 'close', 'night', 'real', 'life', 'few', 'north', 'open', 'seem', 'together', 'next',
  'white', 'children', 'begin', 'got', 'walk', 'example', 'ease', 'paper', 'group', 'always', 'music',
  'those', 'both', 'mark', 'often', 'letter', 'until', 'mile', 'river', 'car', 'feet', 'care', 'second',
  'book', 'carry', 'took', 'science', 'eat', 'room', 'friend', 'began', 'idea', 'fish', 'mountain',
  'stop', 'once', 'base', 'hear', 'horse', 'cut', 'sure', 'watch', 'color', 'face', 'wood', 'main',
  'enough', 'plain', 'girl', 'usual', 'young', 'ready', 'above', 'ever', 'red', 'list', 'though', 'feel',
  'talk', 'bird', 'soon', 'body', 'family', 'direct', 'leave', 'song', 'measure', 'door', 'product',
  'black', 'short', 'numeral', 'class', 'wind', 'question', 'happen', 'complete', 'ship', 'area', 'half',
  'rock', 'order', 'fire', 'south', 'problem', 'piece', 'told', 'knew', 'pass', 'since', 'top', 'whole',
  'king', 'space', 'heard', 'best', 'hour', 'better', 'true', 'during', 'hundred', 'five', 'remember',
  'step', 'early', 'hold', 'west', 'ground', 'interest', 'reach', 'fast', 'verb', 'sing', 'listen', 'six',
  'table', 'travel', 'less', 'morning', 'ten', 'simple', 'several', 'vowel', 'toward', 'war', 'lay',
  'against', 'pattern', 'slow', 'center', 'love', 'person', 'money', 'serve', 'appear', 'road', 'map',
  'rain', 'rule', 'govern', 'pull', 'cold', 'notice', 'voice', 'fall', 'power', 'town', 'fine', 'certain',
  'fly', 'unit', 'lead', 'cry', 'dark', 'machine', 'note', 'wait', 'plan', 'figure', 'star', 'box',
  'noun', 'field', 'rest', 'correct', 'able', 'pound', 'done', 'beauty', 'drive', 'stood', 'contain',
  'front', 'teach', 'week', 'final', 'gave', 'green', 'oh', 'quick', 'develop', 'ocean', 'warm', 'free',
  'minute', 'strong', 'special', 'mind', 'behind', 'clear', 'tail', 'produce', 'fact', 'street', 'inch',
  'multiply', 'nothing', 'course', 'stay', 'wheel', 'full', 'force', 'blue', 'object', 'decide', 'surface',
  'deep', 'moon', 'island', 'foot', 'system', 'busy', 'test', 'record', 'boat', 'common', 'gold',
  'possible', 'plane', 'stead', 'dry', 'wonder', 'laugh', 'thousand', 'ago', 'ran', 'check', 'game',
  'shape', 'equate', 'hot', 'miss', 'brought', 'heat', 'snow', 'tire', 'bring', 'yes', 'distant', 'fill',
  'east', 'paint', 'language', 'among',
]

export type Quote = { text: string; length: 'short' | 'medium' | 'long' }

export const QUOTE_BANK: Quote[] = [
  { length: 'short', text: 'Good habits are built one small choice at a time.' },
  { length: 'short', text: 'Practice does not make perfect, it makes permanent.' },
  { length: 'short', text: 'A calm morning sets the tone for a productive day.' },
  { length: 'short', text: 'Simple tools, used consistently, beat clever ones used rarely.' },
  { length: 'short', text: 'The fastest way to learn a skill is to actually use it.' },
  { length: 'medium', text: 'Every keyboard shortcut you learn today saves you a small amount of time tomorrow, and that time adds up faster than most people expect.' },
  { length: 'medium', text: 'A good typist does not look at the keyboard, does not rush past mistakes, and slowly builds speed as accuracy becomes automatic rather than effortful.' },
  { length: 'medium', text: 'Learning to type quickly is less about moving your fingers faster and more about knowing exactly where every key is without having to think about it.' },
  { length: 'medium', text: 'Consistency matters more than raw speed. A typist who makes fewer mistakes at a steady pace will often finish faster than one who rushes and constantly corrects errors.' },
  { length: 'medium', text: 'The first computers were the size of a room, yet the keyboard layout most people still use today was designed decades before any of that technology existed.' },
  { length: 'long', text: 'Typing well is a strange kind of skill because nobody notices when you do it correctly, but everyone notices when you do it slowly. It rewards patience over speed, and accuracy over confidence, which is why the best typists rarely look like they are trying hard at all.' },
  { length: 'long', text: 'When you first learn to type, every letter feels like a small decision. Over time, whole words start to feel automatic, and eventually your fingers move faster than your conscious mind can keep up with, which is exactly the point where real speed begins to show up.' },
  { length: 'long', text: 'A typing test measures more than just words per minute. It quietly measures how well you handle small mistakes, whether you panic when you fall behind, and whether you can keep a steady rhythm even when the text in front of you gets harder to read.' },
  { length: 'long', text: 'Most people type every single day without ever thinking about how fast or accurate they actually are, which means small inefficiencies pile up quietly over months and years without anyone noticing the slow cost they add up to in the end.' },
  { length: 'long', text: 'The difference between an average typist and a fast one usually is not raw talent. It is thousands of small repetitions, a habit of not looking down at the keyboard, and a willingness to slow down just enough to fix bad habits before they become permanent.' },
  { length: 'long', text: 'Software changes quickly, but the basic act of typing on a keyboard has stayed remarkably similar for a very long time, which means the time you invest in typing well today will likely keep paying off for years, regardless of what tools you end up using.' },
]

export function pickWords(count: number): string[] {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)])
  }
  return words
}

export function pickQuote(length: Quote['length']): Quote {
  const pool = QUOTE_BANK.filter((q) => q.length === length)
  return pool[Math.floor(Math.random() * pool.length)]
}

// Weak-key practice: bias the word pool toward whatever keys the visitor's
// own error history flags as weak, rather than a straight random pool —
// weighted by how many of the target keys each word contains (a word
// hitting 2 weak keys is picked twice as often as one hitting 1), so the
// densest practice words surface more, not just any word that qualifies.
export function pickWeakKeyWords(count: number, weakKeys: string[]): string[] {
  if (weakKeys.length === 0) return pickWords(count)
  const set = new Set(weakKeys.map((k) => k.toLowerCase()))
  const weighted: string[] = []
  for (const w of WORD_LIST) {
    const hits = [...w.toLowerCase()].filter((c) => set.has(c)).length
    for (let i = 0; i < hits; i++) weighted.push(w)
  }
  if (weighted.length === 0) return pickWords(count)
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(weighted[Math.floor(Math.random() * weighted.length)])
  }
  return words
}
