// open ai client
import { OpenAI } from "openai";
import { IBackend } from "../shared/IBackend";

const flattenBuffer = (buffer) => {
  let flatBuffer = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    flatBuffer = flatBuffer.concat(Array.from(buffer.getChannelData(i)));
  }
  return new Float32Array(flatBuffer);
}


async function one() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

  // Access granted, start recording audio
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(1024, 1, 1);

  source.connect(processor);
  processor.connect(context.destination);

  const buffer: any[] = [];

  processor.onaudioprocess = event => {
    buffer.push(event.inputBuffer.getChannelData(0));
  };


  setTimeout(async () => {
    processor.disconnect();
    console.log('disconnected')
    // const audioBlob = new Blob(buffer, { type: 'audio/wav' });

    // Flatten the audio data array into a single Float32Array
    const reducedBuffer = flattenBuffer(buffer);
    //
    // // Send the audio data to the Whisper API
    // const r = await fetch('https://api.openai.com/v1/engines/whisper/jobs', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${openaiKey}`
    //       },
    //       body: JSON.stringify({
    //         prompt: 'transcribe this',
    //         audio: {
    //           data: reducedBuffer.buffer,
    //           type: 'audio/wav'
    //         }
    //       })
    //     }
    // );
    //
    // const data = await r.json();
    // console.log('whisper response', data)
  }, 2000);
}

async function two(backend: IBackend) {

  const r = await backend.request('', 'OpenAI.getCompletion');
  console.log(r);
}

export function MicrophoneUI({ backend }: { backend: IBackend }) {

  return <>
    <button onClick={one}>one</button>
    <button onClick={() => two(backend)}>two</button>
  </>
}