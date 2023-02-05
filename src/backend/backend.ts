import vanjacloud from "vanjacloudjs.shared";

const isDevelopment = process.env.NODE_ENV == 'development';
const isProd = !isDevelopment;

import dotenv from 'dotenv';

// this acutlaly works, I think its bundled
// this will work for now, until I add settings and ~/.vanjacloud keys place
import keys from '../../../keys.json';

const testdb = '4ef4fb0714c9441d94b06c826e74d5d3'
const proddb = '1ccbf2c452d6453d94bc462a8c83c200'
const db = isDevelopment ? testdb : proddb;
const message = {
  type: 'notion',
  notionkey:  keys.NOTION_SECRET, //vanjacloud.Keys.notion,
  dbid: db,
  cwd: process.cwd()
}

const k = dotenv.parse(`${__dirname}/.env`)

console.log('updated')
// get current working directory & log it
console.log('cwd' , process.cwd(), keys);
console.log('dotenv', `${__dirname}/.env`, k)




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
            return message;
        }
        return 'unknown arg'
    }
}
