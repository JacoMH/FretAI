// Split audio data into chunks(windows) to detect what notes are being played in each window

export const splitAudioIntoWindows = async (AudioArray: Float32Array, windowSize: number): Promise<Float32Array[]> => {

    const windows: Float32Array[] = [];

    for (let i = 0; i < AudioArray.length; i += windowSize) {
        const window = AudioArray.slice(i, i + windowSize);

        // do just notes for now, but we need to do a check here for if a chord is playing via spectral flatness

        windows.push(window);
    }

    // 2. You need to actually return the windows array!
    return windows;
}