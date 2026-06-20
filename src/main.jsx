import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PRACTICE_CONFIG, chooseHidden, chooseMinorForm, getDisplayNoteName, getExerciseNotes, getKeyboardPitches, getNoteColor, getTrebleStaffY, makeMelody, noteToMidi, playMelody, playPitch, prepareAudio } from './music'
import './styles.css'

const LEVEL_NAMES = { easy: 'Easy', medium: 'Medium', hard: 'Hard', challenge: 'Challenge' }
const KEY_SIGNATURES = [
  { id: '4-flats', label: '4 flats', major: 'Ab', minor: 'F' },
  { id: '3-flats', label: '3 flats', major: 'Eb', minor: 'C' },
  { id: '2-flats', label: '2 flats', major: 'Bb', minor: 'G' },
  { id: '1-flat', label: '1 flat', major: 'F', minor: 'D' },
  { id: 'none', label: '0 sharps/flats', major: 'C', minor: 'A' },
  { id: '1-sharp', label: '1 sharp', major: 'G', minor: 'E' },
  { id: '2-sharps', label: '2 sharps', major: 'D', minor: 'B' },
  { id: '3-sharps', label: '3 sharps', major: 'A', minor: 'F#' },
  { id: '4-sharps', label: '4 sharps', major: 'E', minor: 'C#' }
]
const getSelectedKey = (signature, mode) => signature[mode]
const getLevelDescription = (length, difficulty) => {
  const { noteCount, hiddenCount } = PRACTICE_CONFIG[length][difficulty]
  return `${hiddenCount === noteCount ? 'All blanks' : `${hiddenCount} ${hiddenCount === 1 ? 'blank' : 'blanks'}`} · ${noteCount} notes`
}
const readProgress = () => { try { return JSON.parse(localStorage.getItem('melody-progress')) || { score: 0, streak: 0 } } catch { return { score: 0, streak: 0 } } }
const Sound = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Zm12.2-.8a5.5 5.5 0 0 1 0 7.6M19.8 5.6a9 9 0 0 1 0 12.8" /></svg>

function Staff({ melody, hidden, completed, currentIndex, labels }) {
  return <div className={`staff length-${melody.length}`} aria-label={`${melody.length}-note melody`}>
    <div className="staff-lines" aria-hidden="true">{[0,1,2,3,4].map(x => <i key={x} />)}</div>
    <div className="notes-row" style={{ '--note-count': melody.length }}>{melody.map((note, index) => {
      const concealed = hidden.includes(index) && !completed.includes(index)
      const isCurrent = currentIndex === index
      const isPast = index < currentIndex
      const color = getNoteColor(note)
      const pitchStyle = { '--pitch-y': concealed ? 'var(--neutral-hidden-y)' : getTrebleStaffY(note) }
      return <div className="note-slot" key={`${note}-${index}`}>
        {concealed ? <div className={`mystery pitch-card neutral-hidden ${isCurrent ? 'current active' : ''}`} style={pitchStyle}>{isCurrent && <span className="playback-marker">▼</span>}<b>?</b></div>
          : <div className={`note pitch-card ${hidden.includes(index) && completed.includes(index) ? 'revealed' : ''} ${isCurrent ? 'current' : ''} ${isPast ? 'completed' : ''} ${note === 'C4' ? 'ledger' : ''}`} style={{ ...pitchStyle, '--note': color.bg, '--note-border': color.border, '--note-shadow': color.shadow }}>{isCurrent && <span className="playback-marker">▼</span>}<b>{labels ? getDisplayNoteName(note) : '♪'}</b></div>}
      </div>
    })}</div>
  </div>
}

function Piano({ onPress, flash, labels, disabled, activeNotes, keyboardPitches }) {
  const activeByMidi = new Map(activeNotes.map(note => [noteToMidi(note), note]))
  const accidentalLetters = new Set(activeNotes.map(getDisplayNoteName).filter(note => /[#b]/.test(note)).map(note => note[0]))
  const whiteKeys = keyboardPitches.filter(note => !getDisplayNoteName(note).includes('#'))
  let whiteCount = 0
  const blackKeys = keyboardPitches.flatMap(note => {
    if (!getDisplayNoteName(note).includes('#')) { whiteCount += 1; return [] }
    return [{ note, after: whiteCount }]
  })
  return <div className="piano" role="group" aria-label="Answer piano keyboard" style={{ '--white-count': whiteKeys.length }}>
    <div className="white-keys">{whiteKeys.map(note => {
      const answerNote = activeByMidi.get(noteToMidi(note))
      const playable = Boolean(answerNote)
      const displayName = getDisplayNoteName(answerNote || note)
      const suppressLabel = !playable && accidentalLetters.has(displayName[0])
      const color = getNoteColor(answerNote || note)
      return <button className={`key white-key ${flash === answerNote ? 'pressed' : ''} ${!playable ? 'future' : ''} ${suppressLabel ? 'label-suppressed' : ''}`} key={note} disabled={disabled || !playable} onClick={() => playable && onPress(answerNote)} style={{ '--key': color.bg, '--key-border': color.border, '--key-shadow': color.shadow }} aria-label={playable ? `Play ${displayName}` : `${displayName}, not in this scale`}>{!suppressLabel && <span>{labels ? displayName : '♪'}</span>}</button>
    })}</div>
    <div className="black-keys">{blackKeys.map(({ note, after }) => {
      const answerNote = activeByMidi.get(noteToMidi(note))
      const playable = Boolean(answerNote)
      const displayName = getDisplayNoteName(answerNote || note)
      const color = getNoteColor(answerNote || note)
      return <button className={`black-key ${playable ? 'scale-key' : 'future'} ${flash === answerNote ? 'pressed' : ''}`} style={{ '--after': after, '--key': color.bg, '--key-border': color.border, '--key-shadow': color.shadow }} disabled={disabled || !playable} onClick={() => playable && onPress(answerNote)} key={note} aria-label={playable ? `Play ${displayName}` : `${displayName}, not in this scale`}>{playable && <span>{labels ? displayName : '♪'}</span>}</button>
    })}</div>
  </div>
}

function Settings({ melodyLength, setMelodyLength, difficulty, setDifficulty, keyMode, setKeyMode, selectedSignatureId, setSelectedSignatureId, labels, setLabels, close }) {
  const selectKey = (signatureId, mode) => {
    setSelectedSignatureId(signatureId)
    setKeyMode(mode)
  }
  return <div className="backdrop" onMouseDown={e => e.target === e.currentTarget && close()}><section className="settings" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    <div className="sheet-head"><div><p className="eyebrow">Choose your mission</p><h2 id="settings-title">Practice settings</h2></div><button className="close" onClick={close} aria-label="Close">×</button></div>
    <fieldset className="settings-group"><legend>Practice range</legend><div className="length-grid">{[5, 8].map(length => <button type="button" className={melodyLength === length ? 'selected' : ''} onClick={() => setMelodyLength(length)} key={length}><strong>{length === 5 ? 'Five-finger range' : 'Full octave range'}</strong></button>)}</div></fieldset>
    <fieldset className="settings-group"><legend>Key signature</legend><div className="signature-grid">{KEY_SIGNATURES.map(signature => {
      const signatureSelected = selectedSignatureId === signature.id
      return <div className={`signature-card ${signatureSelected ? 'selected' : ''}`} role="group" aria-label={signature.label} key={signature.id}><strong>{signature.label}</strong><button type="button" className={`key-option ${signatureSelected && keyMode === 'major' ? 'selected' : ''}`} onClick={() => selectKey(signature.id, 'major')} aria-pressed={signatureSelected && keyMode === 'major'}>{signature.major} major</button><button type="button" className={`key-option ${signatureSelected && keyMode === 'minor' ? 'selected' : ''}`} onClick={() => selectKey(signature.id, 'minor')} aria-pressed={signatureSelected && keyMode === 'minor'}>{signature.minor} minor</button></div>
    })}</div></fieldset>
    <fieldset className="settings-group"><legend>Difficulty</legend><div className="level-grid">{Object.entries(LEVEL_NAMES).map(([value, name]) => <button type="button" className={difficulty === value ? 'selected' : ''} onClick={() => setDifficulty(value)} key={value}><strong>{name}</strong><span>{getLevelDescription(melodyLength, value)}</span></button>)}</div></fieldset>
    <label className="toggle"><span><strong>Note-name labels</strong><small>Show letters on cards and keys</small></span><input type="checkbox" checked={labels} onChange={e => setLabels(e.target.checked)} /><i /></label>
    <button className="primary full" onClick={close}>Ready to listen</button>
  </section></div>
}

function App() {
  const saved = useMemo(readProgress, [])
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('melody-level') || 'easy')
  const [melodyLength, setMelodyLength] = useState(() => Number(localStorage.getItem('melody-length')) === 8 ? 8 : 5)
  const [keyMode, setKeyMode] = useState(() => localStorage.getItem('melody-key-mode') === 'minor' ? 'minor' : 'major')
  const [selectedSignatureId, setSelectedSignatureId] = useState(() => {
    const savedSignature = localStorage.getItem('melody-key-signature')
    if (KEY_SIGNATURES.some(signature => signature.id === savedSignature)) return savedSignature
    const savedMode = localStorage.getItem('melody-key-mode') === 'minor' ? 'minor' : 'major'
    const savedTonic = localStorage.getItem('melody-tonic')
    return KEY_SIGNATURES.find(signature => signature[savedMode] === savedTonic)?.id || 'none'
  })
  const selectedSignature = KEY_SIGNATURES.find(signature => signature.id === selectedSignatureId) || KEY_SIGNATURES[4]
  const tonic = getSelectedKey(selectedSignature, keyMode)
  const [exerciseMinorForm, setExerciseMinorForm] = useState(() => keyMode === 'minor' ? chooseMinorForm() : 'harmonic')
  const [labels, setLabels] = useState(() => localStorage.getItem('melody-labels') !== 'false')
  const [melody, setMelody] = useState(() => makeMelody(difficulty, melodyLength, [], keyMode, tonic, exerciseMinorForm))
  const [hidden, setHidden] = useState(() => chooseHidden(difficulty, melodyLength))
  const [completed, setCompleted] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState(['listen', 'Listen, then play the whole melody'])
  const [score, setScore] = useState(saved.score), [streak, setStreak] = useState(saved.streak)
  const [settings, setSettings] = useState(false), [flash, setFlash] = useState(null), [playing, setPlaying] = useState(false), [advancing, setAdvancing] = useState(false), [audioReady, setAudioReady] = useState(false)
  const first = useRef(true), advanceTimer = useRef(), playbackTimer = useRef(), complete = currentIndex >= melody.length

  useEffect(() => localStorage.setItem('melody-progress', JSON.stringify({ score, streak })), [score, streak])
  useEffect(() => localStorage.setItem('melody-labels', labels), [labels])
  useEffect(() => {
    let mounted = true
    prepareAudio().then(() => mounted && setAudioReady(true)).catch(() => mounted && setFeedback(['wrong', 'Piano sounds could not load']))
    return () => { mounted = false; clearTimeout(advanceTimer.current); clearTimeout(playbackTimer.current) }
  }, [])

  async function play(notes = melody) {
    if (playing || !audioReady) return
    setPlaying(true)
    try {
      const playbackDuration = await playMelody(notes)
      playbackTimer.current = setTimeout(() => setPlaying(false), playbackDuration)
    } catch {
      setPlaying(false)
      setFeedback(['wrong', 'Piano sounds could not play'])
    }
  }
  function next(level = difficulty, length = melodyLength, mode = keyMode, root = tonic) {
    clearTimeout(advanceTimer.current)
    const form = mode === 'minor' ? chooseMinorForm() : 'harmonic'
    const fresh = makeMelody(level, length, melody, mode, root, form)
    setExerciseMinorForm(form)
    setMelody(fresh); setHidden(chooseHidden(level, length)); setCompleted([]); setCurrentIndex(0); setAdvancing(false)
    setFeedback(['listen', level === 'challenge' ? `Listen carefully, then play all ${fresh.length} notes` : 'Listen, then play the whole melody'])
  }
  useEffect(() => {
    if (first.current) { first.current = false; return }
    localStorage.setItem('melody-level', difficulty)
    localStorage.setItem('melody-length', melodyLength)
    localStorage.setItem('melody-key-mode', keyMode)
    localStorage.setItem('melody-key-signature', selectedSignatureId)
    localStorage.setItem('melody-tonic', tonic)
    localStorage.removeItem('melody-minor-type')
    next(difficulty, melodyLength, keyMode, tonic)
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [difficulty, melodyLength, keyMode, selectedSignatureId, tonic])

  function answer(note) {
    if (complete || advancing) return
    playPitch(note); setFlash(note); setTimeout(() => setFlash(null), 220)
    if (note === melody[currentIndex]) {
      const answeredIndex = currentIndex
      const isLast = answeredIndex === melody.length - 1
      setCompleted(done => [...done, answeredIndex])
      setAdvancing(true)
      setFeedback(['correct', isLast ? 'Melody complete!' : 'Nice! Keep going'])
      if (isLast) { setScore(x => x+1); setStreak(x => x+1) }
      advanceTimer.current = setTimeout(() => {
        setCurrentIndex(answeredIndex + 1)
        setAdvancing(false)
      }, 380)
    } else { setFeedback(['wrong', Math.random() > .5 ? 'Try again — you’re close' : 'Listen once more']); setStreak(0) }
  }
  function reset() { setScore(0); setStreak(0); next(); setFeedback(['listen', 'Fresh start — you’ve got this!']) }

  return <main>
    <header><div className="brand"><span>♪</span><div><strong>Melody Detective</strong><small>Listen · Remember · Play</small></div></div><div className="header-actions"><div className="stat"><span>★</span><div><small>Score</small><strong>{score}</strong></div></div><div className="stat streak"><span>🔥</span><div><small>Streak</small><strong>{streak}</strong></div></div><button className="settings-button" onClick={() => setSettings(true)} aria-label="Open settings">⚙</button></div></header>
    <section className="game-card">
      <div className="game-head"><div><p className="eyebrow">{tonic} {keyMode === 'major' ? 'Major' : 'Minor'}</p><h1>Play the melody back</h1></div><button className="listen" onClick={() => play()} disabled={playing || !audioReady}><Sound />{!audioReady ? 'Loading piano…' : playing ? 'Playing…' : 'Play melody'}</button></div>
      <Staff melody={melody} hidden={hidden} completed={completed} currentIndex={currentIndex} labels={labels} />
      <div className={`feedback ${feedback[0]}`} role="status" aria-live="polite"><span>{feedback[0] === 'correct' ? '✓' : feedback[0] === 'wrong' ? '↻' : '♫'}</span>{feedback[1]}</div>
      <div className="keyboard-head"><div><p className="eyebrow">Your piano</p><h2>Play the highlighted note</h2></div><small>{complete ? 'Melody complete!' : `Note ${currentIndex + 1} of ${melody.length}`}</small></div>
      <Piano onPress={answer} flash={flash} labels={labels} disabled={complete || advancing || !audioReady} activeNotes={getExerciseNotes(melodyLength, keyMode, tonic, exerciseMinorForm)} keyboardPitches={getKeyboardPitches(melodyLength, keyMode, tonic, exerciseMinorForm)} />
      <div className="actions"><button className="secondary" onClick={() => play()} disabled={playing || !audioReady}><Sound />{audioReady ? 'Play again' : 'Loading…'}</button><button className="primary" onClick={() => next()} disabled={!complete || playing}>Next question <span>→</span></button></div>
    </section>
    <footer><button onClick={reset}>Reset progress</button><span>•</span><span>All notes play with the same gentle beat</span></footer>
    {settings && <Settings melodyLength={melodyLength} setMelodyLength={setMelodyLength} difficulty={difficulty} setDifficulty={setDifficulty} keyMode={keyMode} setKeyMode={setKeyMode} selectedSignatureId={selectedSignatureId} setSelectedSignatureId={setSelectedSignatureId} labels={labels} setLabels={setLabels} close={() => setSettings(false)} />}
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
