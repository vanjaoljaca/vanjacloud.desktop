import * as ReactDOM from 'react-dom/client';
import React, {useEffect, useRef, useState} from 'react';
import {IBackend} from "../shared/IBackend";
// import vanjacloud from 'vanjacloudjs.shared';
// hacky below, to bypass key load mes temporaril
import {ThoughtDB} from "../../../vanjacloudjs.shared/dist/src/notion";
import {Translator} from "../shared/translate";

let thoughtdb: any = null;

const isDevelopment = process.env.NODE_ENV == 'development';

console.log('isDev', isDevelopment)

function initThoughtDb(notionkey: string, db: string) {
  if(notionkey == null || notionkey == undefined) {
    console.warn('no notion key');
    return;
  }
  thoughtdb = new ThoughtDB(notionkey, db)
}

function getThoughtDb() {
  return thoughtdb;
}

function MyApp() {
  const [text, setText] = useState('Piensalo...');
  const [isSpinning, setIsSpinning] = useState(false);
  const [translation, setTranslation] = useState<string>();

  async function save(msg: string) {

    setIsSpinning(true)
    try {
      await getThoughtDb().saveIt(msg);
    } catch (e) {
      console.log('saveIt failed', e, msg);
    }
    setIsSpinning(false)
  }

  async function onSave() {
    await save(text);
    setText('')
  }

  async function onTranslate() {
    setIsSpinning(true)
    const t = new Translator('key');
    const r1 = await t.translate(text);
    setIsSpinning(false)
    setTranslation(JSON.stringify(r1, null, 2));
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
      if(event.shiftKey) {
        await onTranslate();
      } else {
        await save(text);
        setText('')
      }
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
          filter: isSpinning ? 'blur(5px)' : '',
        }}
    />
    <br/>
    <br/>
    <br/>
    {/*    a button*/}
    <button onClick={onSave}>save</button>
    <button onClick={onTranslate}>translate</button>
    <textarea
        value={translation}
        rows={16} cols={50}/>
  </>
}


function render() {


  ReactDOM.createRoot(
      document.body
      //document.getElementById('root')
  )
  .render(<>
    <h2>Hello from React!</h2>
    <button onClick={onTestThing}>Do Test thing!</button>
    <MyApp/>
  </>);
}

const backend = (window as any).backend as IBackend

// this part doesnt work:
// backend.send('', 'Hello from app.tsx!');
// backend.receive('', (event: any, message: any) => {
//   console.log('app.tsx received message', event, message);
//
//   if(message.type == 'notion') {
//     initThoughtDb(message.notionkey, message.dbid);
//   }
// });

async function onTestThing() {
  const t = new Translator('key');
  const r1 = await t.translate('My Test string');
  console.log('r1', r1);
}

async function init() {
  const r = await backend.request('', 'GetNotionInfo');
  console.log('cwd', r.cwd);
  initThoughtDb(r.notionkey, r.dbid);
}

init();
render();