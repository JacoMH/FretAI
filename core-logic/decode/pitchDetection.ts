// Detect the pitch of each window of audio data and return an array of detected pitches
import { YIN } from 'pitchfinder';

export const pitchDetection = async (windowArray: Float32Array[], sampleRate: number): Promise<(number | null)[]> => {

    const detectPitch = YIN({ sampleRate: sampleRate });

    const detectedPitches: (number | null)[] = [];

    for (let i = 0; i < windowArray.length; i++) {
        const audioChunk = windowArray[i];

        if (audioChunk) {
            const pitch = detectPitch(audioChunk);
            detectedPitches.push(pitch); // Saves the frequency or null
        }
    }

    return detectedPitches;
}