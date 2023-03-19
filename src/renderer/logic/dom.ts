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