// Split audio data into chunks(windows) to detect what notes are being played in each window

export const splitAudioIntoWindows = (AudioArray: Float32Array, hopSize: number, windowSize: number): Float32Array[] => {

    const windows: Float32Array[] = [];

    for (let i = 0; i + hopSize <= AudioArray.length; i += hopSize) {
        const window = AudioArray.slice(i, i + windowSize);

        // do just notes for now, but we need to do a check here for if a chord is playing via spectral flatness

        windows.push(window);
    }

    return windows;
}