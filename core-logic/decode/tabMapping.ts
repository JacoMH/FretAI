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

export const notePositions = (allNoteCandidates: { noteEvent: NoteEvent, candidates: TabPosition[] }[]) => {

    // costs for each candidate, mirrors the allNoteCandidates array.
    const costs = allNoteCandidates.map((item) => ({
        noteEvent: item.noteEvent,
        candidateCosts: item.candidates.map(() => ({ cost: 0, prevIndex: -1 }))
    }));

    //using the context of the entire playtime, run an algorithm to find where best placed all notes are
    for (let i = 1; i < allNoteCandidates.length; i++) {
        const currentNote = allNoteCandidates[i];
        const previousNote = allNoteCandidates[i - 1];
        const currentCosts = costs[i];


        if (!currentNote || !previousNote || !currentCosts) continue;

        for (let j = 0; j < currentNote.candidates.length; j++) {
            //calculate the cost of moving from each previous candidate to this one

            const currentCandidate = currentNote.candidates[j];

            let bestCost = Infinity;
            let bestPrevIndex = 0;
            let cost = 0;

            //previous note candidates
            for (let k = 0; k < previousNote.candidates.length; k++) {
                const previousCandidate = previousNote.candidates[k];

                if (!currentCandidate || !previousCandidate) continue;

                //calculate the cost of moving from previousCandidate to currentCandidate
                cost = Math.abs(currentCandidate.fret - previousCandidate.fret) + Math.abs(currentCandidate.string - previousCandidate.string);

                //add previous costs for overall path 
                const prevCost = costs[i - 1]?.candidateCosts[k]?.cost ?? Infinity; //Infinity used to disqualify candidate if prevCost is undefined
                const totalCost = prevCost + cost;
                if (totalCost < bestCost) {
                    bestCost = totalCost;
                    bestPrevIndex = k;
                }
            }

            currentCosts.candidateCosts[j] = { cost: bestCost, prevIndex: bestPrevIndex }
        }
    }

    // traceback
    const lastNoteCosts = costs.at(-1)?.candidateCosts ?? [];

    let bestFinalIndex = 0;
    let bestFinalCost = Infinity;

    // find the best candidate in the last note
    lastNoteCosts.forEach((cost, i) => {
        if (cost.cost < bestFinalCost) {
            bestFinalCost = cost.cost;
            bestFinalIndex = i;
        }
    });

    // store the chosen index for each note
    const chosenIndices: number[] = new Array(allNoteCandidates.length).fill(0);
    chosenIndices[allNoteCandidates.length - 1] = bestFinalIndex;

    // loop backwards and follow the prevIndex pointers
    for (let i = allNoteCandidates.length - 2; i >= 0; i--) {
        const nextChosen = chosenIndices[i + 1] ?? 0;
        chosenIndices[i] = costs[i + 1]?.candidateCosts[nextChosen]?.prevIndex ?? 0;
    }

    // build the final result
    return allNoteCandidates.map((item, i) => {
        const chosenIndex = chosenIndices[i] ?? 0;
        const chosenPosition = item.candidates[chosenIndex];
        return {
            noteEvent: item.noteEvent,
            string: chosenPosition?.string ?? 1,
            fret: chosenPosition?.fret ?? 0
        };
    });
}

