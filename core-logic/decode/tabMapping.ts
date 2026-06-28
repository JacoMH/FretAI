//map each note onto the fretboard
import type { NoteEvent } from '../interfaces/NoteEvent.js';

interface TabPosition {
    string: number;
    fret: number;
}

const noteToMidi = (note: string): number => {
    //convert note to midi number

    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    const noteName = note.slice(0, -1);
    const octave = parseInt(note.slice(-1));

    let noteIndex = notes.findIndex(n => n === noteName);
    return ((octave + 1) * 12 + noteIndex);
}

export const noteCandidates = (segmentNotes: NoteEvent[]) => {

    //find each spot on the fretboard where the note could be
    const OPEN_STRINGS = [40, 45, 50, 55, 59, 64] // E2, A2, D3, G3, B3, E4
    const NUM_FRETS = 24;
    const allCandidates: { noteEvent: NoteEvent, candidates: TabPosition[] }[] = [];



    //calculate midi number from note
    for (const noteEvent of segmentNotes) {
            const candidates: TabPosition[] = [];

        //convert note to midi

        let midiNumber = noteToMidi(noteEvent.note);

        //find all possible string/fet combinations

        OPEN_STRINGS.forEach((openString, stringIndex) => {
            if (midiNumber >= openString && midiNumber <= openString + NUM_FRETS) {
                const fret = midiNumber - openString;
                candidates.push({ string: stringIndex + 1, fret });
            }
        });

        // inside the loop, after building candidates:
        allCandidates.push({ noteEvent, candidates });
    }
    
    return allCandidates;
}

export const notePositions = (segmentNotes: NoteEvent[]) => {

    //using the context of the entire playtime, run an algorithm to find where best placed all notes are
}
