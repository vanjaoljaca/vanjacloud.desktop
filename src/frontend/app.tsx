import * as ReactDOM from 'react-dom/client';
import React, {useEffect, useRef, useState} from 'react';
import {Backend} from "../Backend";
import {ThoughtDB} from 'vanjacloudjs.shared';

let thoughtdb: any = null;

const isDevelopment = process.env.NODE_ENV == 'development';

console.log('isDev', isDevelopment)

console.log(process.env.NODE_ENV)

function initThoughtDb(notionkey: string, db: string) {
  thoughtdb = new ThoughtDB(notionkey, db)
}

function getThoughtDb() {
  return thoughtdb;
}

function MyApp() {
  const [text, setText] = useState('Piensalo...');
  const [isSaving, setIsSaving] = useState(false);

  async function save(msg: string) {

    setIsSaving(true)
    try {
      await getThoughtDb().saveIt(msg);
    } catch (e) {
      console.log('saveIt failed', e, msg);
    }
    setIsSaving(false)
  }

  async function onSave() {
    await save(text);
    setText('')
  }

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.select();
  }, []);


  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter' && event.metaKey) {
      /* show message box */

      console.log('enter pressed');

      event.preventDefault();
      await save(text);
      setText('')
      // inputRef.current.blur();
    }
  };

  return <>
    <h2>Donk{isDevelopment && ' DEVELOPMENT'}</h2>

    <style>
      {`
          textarea::selection {
            background-color: lightpurple;
          }
        `}
    </style>
    <textarea
        ref={inputRef}
        rows={4} cols={50} autoFocus
        onKeyDown={handleKeyDown}
        value={text}
        onChange={(event) => setText(event.target.value)}
        style={{
          filter: isSaving ? 'blur(5px)' : '',
        }}
    />
    <br/>
    <br/>
    <br/>
    {/*    a button*/}
    <button onClick={onSave}>save</button>
  </>
}


function render() {


  ReactDOM.createRoot(
      document.body
      //document.getElementById('root')
  )
  .render(<>
    <h2>Hello from React!</h2>
    <button onClick={onIpcTest}>IPC Test!</button>
    <MyApp/>
  </>);
}

const backend = (window as any).backend as Backend

// this part doesnt work:
// backend.send('', 'Hello from app.tsx!');
// backend.receive('', (event: any, message: any) => {
//   console.log('app.tsx received message', event, message);
//
//   if(message.type == 'notion') {
//     initThoughtDb(message.notionkey, message.dbid);
//   }
// });

async function onIpcTest() {
  console.log('ipc test empty')
}

async function init() {
  const r = await backend.request('', 'GetNotionInfo');
  initThoughtDb(r.notionkey, r.dbid);
}

init();
render();