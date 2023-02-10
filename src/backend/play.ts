import * as hf from "huggingface-api";

async function transcribeAudio() {
  // Dummy audio data
  const audioData = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);

  // Convert the audio data to base64
  const audioDataBase64 = Buffer.from(audioData.buffer).toString('base64');

  try {


    const response = await hf.request({
      text: 'My name is Jeff and',
      model: 'openai/whisper-large-v2',
      api_key: '',
      return_type: 'STRING'
    })

    console.log(response);
  } catch (error) {
    console.error(error);
  }

}

export default async function play() {

}