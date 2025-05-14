import type { RtAudioDeviceInfo } from "audify";
import pkg from 'audify';
const { RtAudio, RtAudioFormat } = pkg;

import chalk from "chalk";
import { ipcMain } from "electron/main";

import { getWindow } from "./main.js";

const rtAudio = new RtAudio(/* Insert here specific API if needed */);
const devices = rtAudio.getDevices();
const logPrefix = chalk.cyan("[RT Audio Bridge]");

ipcMain.handle("get-realtime-devices", () => {
  return devices;
});

let audioBuffer = Buffer.alloc(0);
let oldBufferSize = 0;
let oldDevice = 0;

const startAudioStream = (device: RtAudioDeviceInfo, channels: number, bufferSize: number, sampleRate: number) => {
  const bufferLengthExpected = bufferSize * channels * RtAudioFormat.RTAUDIO_SINT16;
  const finalSampleRate = sampleRate || device.preferredSampleRate;

  rtAudio.openStream(
    {
      deviceId: device.id, // Output device id (Get all devices using `getDevices`)
      nChannels: channels, // Number of channels
      firstChannel: 0, // First channel index on device (default = 0).
    },
    null,
    RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
    finalSampleRate, // Sampling rate is 48kHz
    bufferSize, // Frame size is 1920 (40ms)
    "Amethyst", // The name of the stream (used for JACK Api)
    (pcm => console.log(pcm.length)), // Input callback function, write every input pcm data to the output buffer
    null, // Input callback function, write every input pcm data to the output buffer
  );
  rtAudio.start();
  rtAudio.outputVolume = 1;

  console.log(logPrefix, "Created realtime audio stream");
  console.log(logPrefix, `﹂Device: ${chalk.blue(device.name)}`);
  console.log(logPrefix, `﹂Buffer size: ${chalk.yellow(bufferSize, "smp")}`);
  console.log(logPrefix, `﹂Expected buffer length: ${chalk.yellow(bufferLengthExpected, "smp")}`);
  console.log(logPrefix, `﹂Channels: ${chalk.yellow(channels, "ch")}`);
  console.log(logPrefix, `﹂Sample Rate: ${chalk.yellow(finalSampleRate, "Hz")}`);
  console.log(logPrefix, `﹂Bit Depth: ${chalk.yellow(RtAudioFormat.RTAUDIO_SINT16 << 3, "bit")}`);
};

const closeAudioStream = () => {
  console.log(logPrefix, "Closing current stream from close request");
  rtAudio.stop();
  rtAudio.closeStream();
};

const restartAudioStream = (device: RtAudioDeviceInfo, channels: number, bufferSize: number, sampleRate: number) => {
  rtAudio.outputVolume = 0;
  getWindow().window.webContents.send("pause-audio-worklet");
  console.log(logPrefix, "Restarting audio stream...");
  closeAudioStream();
  startAudioStream(device, channels, bufferSize, sampleRate);
  rtAudio.outputVolume = 1;
  getWindow().window.webContents.send("resume-audio-worklet");
};

ipcMain.handle("close-realtime-audio-stream", () => {
  closeAudioStream();
});

ipcMain.handle("start-realtime-audio-stream", (_, [device, channels, bufferSize, sampleRate]: [RtAudioDeviceInfo, number, number, number]) => {
  if (!rtAudio.isStreamOpen()) {
    startAudioStream(device, channels, bufferSize, sampleRate);
  }
});

ipcMain.handle("audio-chunk", (_, [device, channels, bufferSize, sampleRate, arrayBuffer]: [RtAudioDeviceInfo, number, number, number, ArrayBuffer]) => {
  const bufferLengthExpected = bufferSize * channels * RtAudioFormat.RTAUDIO_SINT16;

  if (!rtAudio.isStreamOpen()) return;

  // Initiate first value
  if (oldBufferSize == 0) oldBufferSize = bufferSize;
  if (oldDevice == 0) oldDevice = device.id;

  // Check if buffer-size has changed and restart the stream with the new one if so
  if (oldBufferSize != bufferSize) {
    console.log(logPrefix, `Buffer size changed: ${chalk.yellow(oldBufferSize, "smp")} vs ${chalk.yellow(bufferSize, "smp")}`);
    oldBufferSize = bufferSize;
    return restartAudioStream(device, channels, bufferSize, sampleRate);
  }

  // Check if chosen device has changed and restart the stream with the new one if so
  if (oldDevice != device.id) {
    console.log(logPrefix, `Device changed: ${chalk.blue(oldDevice)} vs ${chalk.blue(device.id)}`);
    oldDevice = device.id;
    return restartAudioStream(device, channels, bufferSize, sampleRate);
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