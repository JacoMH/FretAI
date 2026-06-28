//Converts uploaded audio file into an array of PCM float32 samples
import * as webAudio from 'web-audio-api';
const { AudioContext } = webAudio;

import decode from 'audio-decode';
import { readFileSync } from 'fs';

export const decodeAudioFile = async (file: File): Promise<{samples: Float32Array, sampleRate: number}> => {

    //convert file to arrayBuffer for decoding (currently raw compressed binary bytes)
    const arrayBuffer = await file.arrayBuffer();

    //decode the audio file into an AudioBuffer
    const audioBuffer = await decode(arrayBuffer); //get the sample rate from here to give to the pitch detection function, also number of channels etc.

    //maybe do checks here for the different types of metadata before continuing, like sample rate, 
    // number of channels, etc. For now, just assume it's a single channel (mono) audio file

    if (!(audioBuffer.channelData[0])) {
        throw new Error("Audio file does not contain any channel data.");
    }
    else {
        return { samples: audioBuffer.channelData[0], sampleRate: audioBuffer.sampleRate }; //get the PCM float32 samples for the first channel (mono)
    }
}