const RT60_CONSTANT = 0.161;

export interface RoomDimensions {
  width: number;
  length: number; 
  height: number;
}

// The volume parameter is the volume of the room in cubic meters and the absorptionCoefficient 
// is a value that represents the room's absorption characteristics. 

// This value can range from 0 to 1, with 1 indicating complete absorption and 0 indicating no absorption.
export const calculateRT60 = (volume: number, absorptionCoefficient: number) => {
  return RT60_CONSTANT * volume / absorptionCoefficient;
};

// The width, length, and height parameters are the dimensions of the room in meters 
// and the absorptionCoefficient is the same value used in the calculateRT60 function.

// This function calculates the volume of the room by multiplying the width, length and height 
// and then uses the calculateRT60 function to calculate RT60 based on
export const calculateRT60ByDimensions = ({width, length, height}: RoomDimensions, absorptionCoefficient: number) => {
  const volume = width * length * height;
  return calculateRT60(volume, absorptionCoefficient);
};

// The width, length, and height parameters are the dimensions of the room in meters. 
// The function loops over i, j, and k values from 1 to 50 to calculate the room modes. 
// The frequency of each mode is calculated using the formula (i * j * k * 340) / (2 * width * length), 
// where 340 is the speed of sound in air.

// The function returns an array of objects, where each object represents a room mode with the values 
// for i, j, k, and the frequency of the mode. The frequency values are in hertz (Hz).
export const calculateRoomModes = ({width, length, height}: RoomDimensions) => {
  const modes = [];
  for (let i = 1; i <= 50; i++) {
    for (let j = 1; j <= 50; j++) {
      for (let k = 1; k <= 50; k++) {
        const frequency = (2 * i * j * k * 340) / (width * length * height);
        modes.push({ i, j, k, frequency });
      }
    }
  }
  return modes;
};