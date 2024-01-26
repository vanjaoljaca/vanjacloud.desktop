
const isDevelopment = process.env.NODE_ENV == 'development';

// import dotenv from 'dotenv';
// dotenv.config();
import { Thought } from "vanjacloud.shared.js";
const ThoughtDB = Thought.ThoughtDB;


// this acutlaly works, I think its bundled
// this will work for now, until I add settings and ~/.vanjacloud keys place
import keys from '../../../keys.json';



import { OpenAI } from "openai";

const db = isDevelopment ? ThoughtDB.testdbid : ThoughtDB.proddbid;
const keysmessage = {
  type: 'notion',
  notionkey: keys.NOTION_SECRET,
  dbid: db,
  azureTranslateKey: keys.AZURE_TRANSLATE_KEY,
  cwd: process.cwd()
}


const configuration = {
  apiKey: keys.OPENAI_KEY,
};
const openai = new OpenAI(configuration);

import playExternal from './play'



async function play() {
  // const m = await openai.listModels();
  // console.log(m);
  // await transcribeAudio();
  await playExternal();
}


export default class Backend {
  frontend: any;

  constructor(frontend: any) {
    this.frontend = frontend;
    // setInterval(() => {
    //     // send('ping', 'ping from backend');
    //     // console.log('backend: sending ping');
    // }, 5000);
  }

  // I wonder if you can ipc send a closure?

  async accept(event: any, arg: any) {
    console.log('backend.accept', arg);
  }

  async request(event: any, arg: any) {
    console.log('backend.ts received', arg);
    const isDevelopment = process.env.NODE_ENV == 'development';
    console.log('isDev', isDevelopment)
    if (arg == 'GetNotionInfo') {
      return keysmessage;
    }
    if (arg == 'dev') {
      await play();
    }
    if (arg == 'OpenAI.getCompletion') {
      console.log('updated!!!')

      // ---
      const r = await openai.completions.create({
        model: "text-davinci-003",
        prompt: "This is a test prompt",
      });

      return r.choices[0].text
    }
    return 'unknown arg'
  }
}
