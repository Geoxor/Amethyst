const RT60_CONSTANT = 0.161;
// 0°C in Kelvin, represents the difference between the Celsius and Kelvin temperature scales.
const ABSOLUTE_ZERO = 273.15;
// Speed of sound in air at 20°C (68°F)
const SPEED_OF_SOUND = 340.29;
const AVERAGE_ABSORPTION_COEFFICIENT = 0.16;

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export function calculateSpeedOfSound(temperature: number) {
  // Speed of sound in air varies with temperature
  // Reference: https://en.wikipedia.org/wiki/Speed_of_sound#Temperature

  // The 273.15 in the formula Math.sqrt(1 + (temperature - 20) / 273.15) is the difference 
  // between the reference temperature of 20°C (68°F) and the absolute zero temperature in Kelvin (K).
  return SPEED_OF_SOUND * Math.sqrt(1 + (temperature - 20) / ABSOLUTE_ZERO);
}

// The volume parameter is the volume of the room in cubic meters and the absorptionCoefficient 
// is a value that represents the room's absorption characteristics. 

// This value can range from 0 to 1, with 1 indicating complete absorption and 0 indicating no absorption.
export const calculateRT60 = (volume: number, absorptionCoefficient: number) => {
  return RT60_CONSTANT * volume / absorptionCoefficient;
};

// The width, length and height parameters are the dimensions of the room in meters 
// and the absorptionCoefficient is the same value used in the calculateRT60 function.

// This function calculates the volume of the room by multiplying the width, length and height 
// and then uses the calculateRT60 function to calculate RT60 based on
// and returns it in milliseconds.
export const calculateRT60ByDimensions = ({width, length, height}: RoomDimensions, absorptionCoefficient = AVERAGE_ABSORPTION_COEFFICIENT) => {
  const volume = width * length * height;
  return calculateRT60(volume, absorptionCoefficient);
};

// The width, length and height parameters are the dimensions of the room in meters. 
// The function loops over i, j and k values from 1 to 50 to calculate the room modes. 
// The frequency of each mode is calculated using the formula (i * j * k * 340) / (2 * width * length), 
// where 340 is the speed of sound in air.

// The function returns an array of objects, where each object represents a room mode with the values 
// for i, j, k and the frequency of the mode. The frequency values are in hertz (Hz).

// The number of modes to calculate is specified by the modeCount parameter.
// The 2 in the formula is a mathematical constant that represents the number of positive and negative cycles in a wave.
export const calculateRoomModes = ({width, length, height}: RoomDimensions, modeCount = 50) => {
  const modes = [];
  for (let i = 1; i <= modeCount; i++) {
    for (let j = 1; j <= modeCount; j++) {
      for (let k = 1; k <= modeCount; k++) {
        const frequency = (2 * i * j * k * calculateSpeedOfSound(20)) / (width * length * height);
        modes.push({ i, j, k, frequency });
      }
    }
  }
  return modes;
};