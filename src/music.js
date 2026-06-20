export const NOTE_RANGES = {
  beginner: ['C4', 'D4', 'E4', 'F4', 'G4'],
  octave: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  upperG: ['G4', 'A4', 'B4', 'C5', 'D5'],
  upperA: ['A4', 'B4', 'C5', 'D5', 'E5'],
}

export const NOTES = NOTE_RANGES.beginner
export const STABLE_NOTES = ['C4', 'E4', 'G4']
export const KEY_CONFIGS = Object.freeze({
  major: Object.freeze({
    C: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
    G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'],
    D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
    A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
    E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'],
    F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F'],
    Bb: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
    Eb: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D', 'Eb'],
    Ab: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G', 'Ab'],
  }),
  minor: Object.freeze({
    A: { harmonic: ['A', 'B', 'C', 'D', 'E', 'F', 'G#', 'A'], melodic: ['A', 'B', 'C', 'D', 'E', 'F#', 'G#', 'A'] },
    E: { harmonic: ['E', 'F#', 'G', 'A', 'B', 'C', 'D#', 'E'], melodic: ['E', 'F#', 'G', 'A', 'B', 'C#', 'D#', 'E'] },
    B: { harmonic: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A#', 'B'], melodic: ['B', 'C#', 'D', 'E', 'F#', 'G#', 'A#', 'B'] },
    'F#': { harmonic: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E#', 'F#'], melodic: ['F#', 'G#', 'A', 'B', 'C#', 'D#', 'E#', 'F#'] },
    'C#': { harmonic: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B#', 'C#'], melodic: ['C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B#', 'C#'] },
    D: { harmonic: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#', 'D'], melodic: ['D', 'E', 'F', 'G', 'A', 'B', 'C#', 'D'] },
    G: { harmonic: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F#', 'G'], melodic: ['G', 'A', 'Bb', 'C', 'D', 'E', 'F#', 'G'] },
    C: { harmonic: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B', 'C'], melodic: ['C', 'D', 'Eb', 'F', 'G', 'A', 'B', 'C'] },
    F: { harmonic: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'E', 'F'], melodic: ['F', 'G', 'Ab', 'Bb', 'C', 'D', 'E', 'F'] },
  }),
})
export const PRACTICE_CONFIG = Object.freeze({
  5: Object.freeze({
    easy: Object.freeze({ noteCount: 5, hiddenCount: 1 }),
    medium: Object.freeze({ noteCount: 5, hiddenCount: 2 }),
    hard: Object.freeze({ noteCount: 5, hiddenCount: 3 }),
    challenge: Object.freeze({ noteCount: 5, hiddenCount: 5 }),
  }),
  8: Object.freeze({
    easy: Object.freeze({ noteCount: 8, hiddenCount: 2 }),
    medium: Object.freeze({ noteCount: 8, hiddenCount: 4 }),
    hard: Object.freeze({ noteCount: 8, hiddenCount: 6 }),
    challenge: Object.freeze({ noteCount: 8, hiddenCount: 8 }),
  }),
})

const PITCH_CLASSES = { Cb: -1, C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, 'E#': 5, Fb: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, 'B#': 12 }
const NATURAL_PITCH_CLASSES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
// Explicit teaching registers keep each scale in a comfortable treble-staff area.
// In particular, Bb must begin below middle C instead of defaulting to Bb4.
export const FULL_OCTAVE_TONIC_OCTAVES = Object.freeze({
  major: Object.freeze({ C: 4, G: 3, D: 4, A: 3, E: 4, F: 4, Bb: 3, Eb: 4, Ab: 3 }),
  minor: Object.freeze({ A: 3, E: 4, B: 3, 'F#': 4, 'C#': 4, D: 4, G: 3, C: 4, F: 4 }),
})

export function noteToMidi(note) {
  const match = note.match(/^([A-G])(#|b)?(-?\d+)$/)
  if (!match) throw new Error(`Unsupported pitch: ${note}`)
  const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0
  return (Number(match[3]) + 1) * 12 + NATURAL_PITCH_CLASSES[match[1]] + accidental
}

export function midiToPitch(midi) {
  return `${SHARP_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`
}

function spellScalePitches(mode = 'major', tonic = 'C', minorType = 'harmonic') {
  const key = KEY_CONFIGS[mode]?.[tonic]
  const scale = mode === 'minor' ? key?.[minorType] : key
  if (!scale) throw new Error(`Unsupported key: ${tonic} ${mode}`)
  const tonicOctave = FULL_OCTAVE_TONIC_OCTAVES[mode]?.[tonic]
  if (!Number.isInteger(tonicOctave)) throw new Error(`Missing teaching register: ${tonic} ${mode}`)
  const tonicMidi = 12 * (tonicOctave + 1) + PITCH_CLASSES[tonic]
  return scale.map((name, index) => {
    const delta = index === scale.length - 1 ? 12 : (PITCH_CLASSES[name] - PITCH_CLASSES[tonic] + 12) % 12
    const midi = tonicMidi + delta
    const approximateOctave = Math.floor(midi / 12) - 1
    const octave = [approximateOctave - 1, approximateOctave, approximateOctave + 1].find(candidate => noteToMidi(`${name}${candidate}`) === midi)
    return `${name}${octave}`
  })
}

export function getExerciseNotes(noteCount, mode = 'major', tonic = 'C', minorType = 'harmonic') {
  const notes = spellScalePitches(mode, tonic, minorType)
  return noteCount === 5 ? notes.slice(0, 5) : notes
}

export function getKeyboardPitches(noteCount, mode = 'major', tonic = 'C', minorType = 'harmonic') {
  const activeNotes = getExerciseNotes(noteCount, mode, tonic, minorType)
  let start = noteToMidi(activeNotes[0])
  let end = noteToMidi(activeNotes.at(-1))
  // A black tonic needs its neighboring white keys to preserve real piano
  // geometry; those visual support keys remain inactive.
  if (/[#b]/.test(getDisplayNoteName(activeNotes[0]))) start -= 1
  if (/[#b]/.test(getDisplayNoteName(activeNotes.at(-1)))) end += 1
  return Array.from({ length: end - start + 1 }, (_, index) => midiToPitch(start + index))
}

export const NOTE_COLORS = {
  C: { bg: '#FCA5A5', border: '#EF4444', shadow: 'rgba(239, 68, 68, 0.22)' },
  D: { bg: '#FDBA74', border: '#F97316', shadow: 'rgba(249, 115, 22, 0.22)' },
  E: { bg: '#FDE68A', border: '#EAB308', shadow: 'rgba(234, 179, 8, 0.22)' },
  F: { bg: '#86EFAC', border: '#22C55E', shadow: 'rgba(34, 197, 94, 0.22)' },
  G: { bg: '#93C5FD', border: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.22)' },
  A: { bg: '#D8B4FE', border: '#A855F7', shadow: 'rgba(168, 85, 247, 0.22)' },
  B: { bg: '#F9A8D4', border: '#EC4899', shadow: 'rgba(236, 72, 153, 0.22)' },
}

// Half-step staff positions measured downward from F5, the treble staff's top
// line. Each diatonic step moves by half the distance between two staff lines.
const LETTER_STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

export function getTrebleStaffY(noteName) {
  const match = noteName.match(/^([A-G])(?:#|b)?(-?\d+)$/)
  if (!match) throw new Error(`Unsupported treble staff note: ${noteName}`)
  const diatonicIndex = Number(match[2]) * 7 + LETTER_STEPS[match[1]]
  const topLineF5 = 5 * 7 + LETTER_STEPS.F
  const step = topLineF5 - diatonicIndex
  return `calc(var(--staff-top) + ${step} * var(--staff-half-step))`
}

export function getNoteLetter(noteName) {
  return noteName.match(/[A-G]/)?.[0] || 'C'
}

export function getNoteColor(noteName) {
  return NOTE_COLORS[getNoteLetter(noteName)]
}

export const getDisplayNoteName = noteName => noteName.replace(/-?\d+/g, '')

const randomItem = (items) => items[Math.floor(Math.random() * items.length)]
export const MINOR_FORMS = Object.freeze(['harmonic', 'melodic'])
export const chooseMinorForm = () => randomItem(MINOR_FORMS)

export function makeMelody(difficulty, noteCount = 5, previous = [], mode = 'major', tonic = 'C', minorType = 'harmonic') {
  const practice = PRACTICE_CONFIG[noteCount]
  const config = practice?.[difficulty]
  if (!config) throw new Error(`Unsupported practice mode: ${noteCount} notes, ${difficulty}`)
  const notes = getExerciseNotes(noteCount, mode, tonic, minorType)
  const stableDegrees = noteCount === 8 ? [0, 2, 4, 7] : [0, 2, 4]
  const stableNotes = stableDegrees.map(index => notes[index])
  let melody = []
  let attempts = 0
  do {
    melody = [randomItem(stableNotes)]
    for (let i = 1; i < config.noteCount - 1; i += 1) {
      const last = notes.indexOf(melody[i - 1])
      let choices
      if (difficulty === 'easy') {
        choices = notes.filter((_, index) => Math.abs(index - last) <= 1)
        if (Math.random() < 0.15) choices = notes
      } else if (difficulty === 'medium' || difficulty === 'hard') {
        choices = notes.filter((_, index) => Math.abs(index - last) <= 2)
      } else choices = notes
      choices = choices.filter(note => melody.filter(usedNote => usedNote === note).length < 2)
      // A narrow stepwise pool can be exhausted; regenerate the whole clip
      // rather than allowing a pitch to appear a third time.
      if (!choices.length) break
      melody.push(randomItem(choices))
    }
    if (melody.length !== config.noteCount - 1) {
      attempts += 1
      continue
    }
    const penultimate = notes.indexOf(melody[config.noteCount - 2])
    const finalDistance = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : Infinity
    const availableEndings = stableNotes.filter(note => melody.filter(usedNote => usedNote === note).length < 2)
    if (!availableEndings.length) {
      attempts += 1
      continue
    }
    const groundedEndings = availableEndings.filter(note => Math.abs(notes.indexOf(note) - penultimate) <= finalDistance)
    melody.push(randomItem(groundedEndings.length ? groundedEndings : availableEndings))
    attempts += 1
  } while (attempts < 200 && (melody.length !== config.noteCount || melody.join() === previous.join()))
  if (melody.length !== config.noteCount) {
    // Deterministic, rule-safe fallback after the retry cap.
    const fallback = notes.slice(0, config.noteCount - 1)
    const ending = stableNotes.find(note => !fallback.includes(note)) || stableNotes[0]
    return [...fallback, ending]
  }
  return melody
}

export function chooseHidden(difficulty, noteCount = 5) {
  const config = PRACTICE_CONFIG[noteCount]?.[difficulty]
  if (!config) throw new Error(`Unsupported practice mode: ${noteCount} notes, ${difficulty}`)
  if (difficulty === 'challenge') return Array.from({ length: config.noteCount }, (_, index) => index)

  const candidates = Array.from({ length: config.noteCount - 1 }, (_, index) => index + 1)
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]]
  }
  return candidates.slice(0, config.hiddenCount).sort((a, b) => a - b)
}

export const PLAYBACK_CONFIG = Object.freeze({
  tempo: 75,
  beatSeconds: 0.8,
  holdTime: 0.86,
  scheduleAhead: 0.08,
  velocity: 0.72,
  attack: 0.01,
  release: 0.5,
})

let audioContext
let samplesReady
const sampleBuffers = new Map()
// F4's recording has an unusually short tail, so nearby sampled piano notes
// provide a smoother, consistent voice across every supported key.
const SAMPLE_NOTES = ['C4', 'D4', 'E4', 'G4']

function getSampleVoice(note) {
  const targetMidi = noteToMidi(note)
  const source = SAMPLE_NOTES.reduce((best, candidate) => Math.abs(noteToMidi(candidate) - targetMidi) < Math.abs(noteToMidi(best) - targetMidi) ? candidate : best)
  return { source, playbackRate: 2 ** ((targetMidi - noteToMidi(source)) / 12) }
}

function getAudioContext() {
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)()
  return audioContext
}

// Decode the aligned, full-tail piano samples once before enabling playback.
export function prepareAudio() {
  if (samplesReady) return samplesReady
  const context = getAudioContext()
  samplesReady = Promise.all(SAMPLE_NOTES.map(async note => {
    const response = await fetch(`/audio/${note}.wav`)
    if (!response.ok) throw new Error(`Could not load piano sample ${note}`)
    sampleBuffers.set(note, await context.decodeAudioData(await response.arrayBuffer()))
  }))
  return samplesReady
}

function scheduleVoice(note, startTime, holdTime) {
  const context = getAudioContext()
  const source = context.createBufferSource()
  const gain = context.createGain()
  const voice = getSampleVoice(note)
  source.buffer = sampleBuffers.get(voice.source)
  source.playbackRate.setValueAtTime(voice.playbackRate, startTime)
  source.connect(gain).connect(context.destination)

  const { attack, release, velocity } = PLAYBACK_CONFIG
  const releaseStart = startTime + holdTime
  const releaseEnd = releaseStart + release
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(velocity, startTime + attack)
  gain.gain.setValueAtTime(velocity, releaseStart)
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd)
  source.start(startTime)
  source.stop(releaseEnd + 0.02)
}

export async function playPitch(note) {
  const context = getAudioContext()
  // Request resume synchronously inside the user gesture. A suspended audio
  // clock does not advance, so events scheduled just ahead remain aligned.
  context.resume().catch(() => {})
  await prepareAudio()
  scheduleVoice(note, context.currentTime + 0.015, 0.72)
}

export async function playMelody(notes) {
  const context = getAudioContext()
  context.resume().catch(() => {})
  await prepareAudio()

  const { beatSeconds, holdTime, release, scheduleAhead } = PLAYBACK_CONFIG
  const startTime = context.currentTime + scheduleAhead
  notes.forEach((note, index) => {
    scheduleVoice(note, startTime + index * beatSeconds, holdTime)
  })

  return Math.ceil((scheduleAhead + (notes.length - 1) * beatSeconds + holdTime + release) * 1000)
}
