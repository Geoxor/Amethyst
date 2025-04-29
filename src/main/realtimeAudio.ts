import type { RtAudioDeviceInfo} from "audify";
import { RtAudio, RtAudioFormat } from "audify";
import chalk from "chalk";
import { ipcMain } from "electron/main";

const rtAudio = new RtAudio(/* Insert here specific API if needed */);
const devices = rtAudio.getDevices();
const logPrefix = chalk.blue("RT Audio");

console.log(devices);

ipcMain.handle("get-realtime-devices", () => {
  return devices;
});

let audioBuffer = Buffer.alloc(0);
let oldBufferSize = 0;
let oldDevice = 0;

ipcMain.handle("close-realtime-audio-stream", () => {
  console.log(logPrefix, "Closing current stream from close request");
  rtAudio.stop();
  rtAudio.closeStream();
});

ipcMain.handle("audio-chunk", (_, [device, numChannels, bufferSize, arrayBuffer]: [RtAudioDeviceInfo, number, number, ArrayBuffer]) => {
  // You should set up rtAudio once, not per chunk

  const bufferLengthExpected = bufferSize * numChannels * RtAudioFormat.RTAUDIO_SINT16;

  if (!rtAudio.isStreamOpen()) {
    rtAudio.openStream(
      {
        deviceId: device.id, // Output device id (Get all devices using `getDevices`)
        nChannels: numChannels, // Number of channels
        firstChannel: 0, // First channel index on device (default = 0).
      },
      null,
      RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
      device.preferredSampleRate, // Sampling rate is 48kHz
      bufferSize, // Frame size is 1920 (40ms)
      "Amethyst", // The name of the stream (used for JACK Api)
      (pcm => console.log(pcm.length)), // Input callback function, write every input pcm data to the output buffer
      null, // Input callback function, write every input pcm data to the output buffer
    );
    rtAudio.start();
    rtAudio.outputVolume = 1;

    console.log(logPrefix, "Created realtime audio stream");
    console.log(logPrefix, `Device: ${device.name}`);
    console.log(logPrefix, `Buffer: ${bufferSize}`);
    console.log(logPrefix, `Sample Rate: ${device.preferredSampleRate}`);
    console.log(logPrefix, `Bit Depth: ${RtAudioFormat.RTAUDIO_SINT16}`);
    console.log(logPrefix, `Expected buffer length: ${bufferLengthExpected}`);
  }

  // Initiate first value
  if (oldBufferSize == 0) oldBufferSize = bufferSize;
  if (oldDevice == 0) oldDevice = device.id;

  // Check if buffer-size has changed and restart the stream with the new one if so
  if (oldBufferSize != bufferSize) {
    console.log(logPrefix, `Buffer size changed: ${oldBufferSize} vs ${bufferSize}`);
    console.log(logPrefix, "Closing current stream");
    oldBufferSize = bufferSize;
    rtAudio.stop();
    rtAudio.closeStream();
    return;
  }

  // Check if chosen device has changed and restart the stream with the new one if so
  if (oldDevice != device.id) {
    console.log(logPrefix, `Device changed: ${oldDevice} vs ${device.id}`);
    console.log(logPrefix, "Closing current stream");
    oldDevice = device.id;
    rtAudio.stop();
    rtAudio.closeStream();
    return;
  }

  // Update with latest buffer size to see if it has changed in the next loop
  oldBufferSize = bufferSize;

  audioBuffer = Buffer.concat([audioBuffer, Buffer.from(arrayBuffer)]);

  while (audioBuffer.length >= bufferLengthExpected) {
    const chunkToWrite = audioBuffer.subarray(0, bufferLengthExpected);
    try {
      rtAudio.write(chunkToWrite);
      audioBuffer = audioBuffer.subarray(bufferLengthExpected); // Remove written data
    } catch (error) {
      rtAudio.closeStream();
      console.log(error);
    }
  }
});