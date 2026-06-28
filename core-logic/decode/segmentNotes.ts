// detect the actual notes being played in each window of audio data
import type { NoteEvent } from '../interfaces/NoteEvent.js';

enum NoteState {
    SILENT = "SILENT",
    DETECTING = "DETECTING",
    PLAYING = "PLAYING"
}

const frequencyToNote = (frequency: number) => {
    const midiNumber = Math.round(69 + 12 * Math.log2(frequency / 440));
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteName = notes[midiNumber % 12];
    const octave = Math.floor(midiNumber / 12) - 1;
    return `${noteName}${octave}`;
}

export const detectNotesInWindows = (pitches: (number | null)[], hopSize: number, sampleRate: number): NoteEvent[] => {

    const noteEvents: NoteEvent[] = [];
    let state: NoteState = NoteState.SILENT;
    let startIndex = 0;
    let currentFrequency = 0;

    for (let i = 0; i < pitches.length; i++) {
        const pitch = pitches[i] ?? null;

        if (state === NoteState.SILENT && pitch !== null) {
            state = NoteState.PLAYING;
            startIndex = i;
            currentFrequency = pitch;
        }
        else if (state === NoteState.PLAYING && pitch === null) {
            state = NoteState.SILENT;
            noteEvents.push({
                note: frequencyToNote(currentFrequency),
                startTime: (startIndex * hopSize) / sampleRate,
                endTime: (i * hopSize) / sampleRate,
                frequency: currentFrequency
            });
        }
    }

    if (state === NoteState.PLAYING) {
        noteEvents.push({
            note: frequencyToNote(currentFrequency),
            startTime: (startIndex * hopSize) / sampleRate,
            endTime: (pitches.length * hopSize) / sampleRate,
            frequency: currentFrequency
        });
    }

    return noteEvents;
}