import vanjacloud from "vanjacloudjs.shared";

const isDevelopment = process.env.NODE_ENV == 'development';
const isProd = !isDevelopment;
import * as hf from 'huggingface-api'

import fetch from 'node-fetch';
import axios from "axios";

const WHISPER_API_URL = 'https://api.openai.com/v1/engines/whisper/jobs';

import dotenv from 'dotenv';

// this acutlaly works, I think its bundled
// this will work for now, until I add settings and ~/.vanjacloud keys place
import keys from '../../../keys.json';
const k = dotenv.parse(`${__dirname}/.env`)

import {Configuration, OpenAIApi} from "openai";

const testdb = '4ef4fb0714c9441d94b06c826e74d5d3'
const proddb = '1ccbf2c452d6453d94bc462a8c83c200'
const db = isDevelopment ? testdb : proddb;
const keysmessage = {
  type: 'notion',
  notionkey:  keys.NOTION_SECRET,
  dbid: db,
  azureTranslateKey: keys.AZURE_TRANSLATE_KEY,
  cwd: process.cwd()
}


const configuration = new Configuration({
    apiKey: keys.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

import playExternal from './play'


async function play() {
  console.log('good stuff ehre -------')
  // const m = await openai.listModels();
  // console.log(m);
  // await transcribeAudio();
  console.log('external now-----');
  await playExternal();
  console.log('good stuff ehre -------')
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
        if(arg == 'GetNotionInfo') {
            return keysmessage;
        }
        if(arg == 'dev') {
          await play();
        }
        if(arg == 'OpenAI.getCompletion') {
          console.log('updated!!!')

          // ---
          const r = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: "This is a test prompt",
          });

          return r.data.choices[0].text
        }
        return 'unknown arg'
    }
}
