import { TIMEOUT_SECONDS } from "./config.js";

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(
        new Error(`Request took too long!! Timeout after ${seconds} seconds `)
      );
    }, seconds * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([
      fetch(`${url}`),
      timeout(TIMEOUT_SECONDS),
    ]);
    // console.log(`Response ::`, response);

    const data = await response.json();
    // console.log(`Data ::`, data);
    // console.log(data.data);

    if (!response.ok)
      throw new Error(`Message : ${data.message}, status : ${response.status}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const sendData = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([sendData, timeout(TIMEOUT_SECONDS)]);

    const data = await response.json();

    if (!response.ok)
      throw new Error(`Message: ${data.message}, status : ${response.status}`);

    return data;
  } catch (error) {
    throw error;
  }
};
