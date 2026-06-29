//takes the note events and converts them to a .mid file 
import { Midi } from '@tonejs/midi';
import type { NoteEvent } from '../interfaces/NoteEvent.js';

export const midiEncoding = (noteEvents: NoteEvent[], trackName: string = "Pipeline Output") => {
    const midi = new Midi();
    const track = midi.addTrack();
    
    // Dynamically names the track based on user choice
    track.name = trackName; 

    // Loop through note events safely
    noteEvents.forEach(event => {
        track.addNote({
            pitch: event.note,
            time: event.startTime,
            duration: event.endTime - event.startTime,
            velocity: 0.8 // default velocity
        } as any); // 👈 Bypasses the strict TypeScript union validation check
    });

    // Convert to binary array buffer and return it
    const midiArrayBuffer = midi.toArray();
    return Buffer.from(midiArrayBuffer);
};