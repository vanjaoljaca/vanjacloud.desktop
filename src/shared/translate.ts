import axios from "axios";

import {v4 as uuidv4} from "uuid";


const endpoint = "https://api.cognitive.microsofttranslator.com";

// location, also known as region.
// required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
const location = "westus3";


export class Translator {
  constructor(private key: string) {

  }

  async translate(text: string, to?: string[], from?: string) {

    to = to || ['en', 'de', 'es', 'sr-Cyrl-BA'];

    const r = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': from,
        'to': to
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });
    return r.data[0].translations;
  }
}