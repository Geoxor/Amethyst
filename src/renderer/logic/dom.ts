/**
 * @returns the total number of DOM elements present in a HTML document.
 */
export const countDomElements = () => document.getElementsByTagName("*").length;

/**
 * Refreshes the current window by reloading the page.
 */
export const refreshWindow = () => location.reload();

export const saveArrayBufferToFile = (arrayBuffer: ArrayBuffer, options: { filename: string, extension: string }) => {
  const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${options.filename}.${options.extension}`;

  document.body.appendChild(link); // add the link to the DOM
  link.click(); // simulate a click on the link to start the download

  document.body.removeChild(link); // remove the link from the DOM
  URL.revokeObjectURL(url); // release the URL object
};

/**
 * Animates smoothly from a start number to the desired number within a given timeframe Δ and calls back with the tweened number at that time
 */
export const smoothTween = ( startValue: number, endValue: number, delta: number, callback: (tweenedNumber: number) => void) => {
  let startTime: number | undefined;

  function update(currentTime: number) {
    if (startTime === undefined) startTime = currentTime;
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= delta) {
      callback(endValue);
    } else {
      const progress = elapsedTime / delta;
      const easedValue = startValue + (endValue - startValue) * progress;
      callback(easedValue);
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
};