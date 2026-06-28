//Core logic for handling audio decoding and processing
import { decodeAudioFile } from './decode/decode.js';

const HOP_SIZE = 512;
const WINDOW_SIZE = 2048;

