// eslint-disable-next-line @typescript-eslint/no-var-requires
require('source-map-support').install();

import 'web-streams-polyfill';

import * as ReactDOM from 'react-dom/client';
import React, { useEffect, useRef, useState } from 'react';
import { IBackend } from "../shared/IBackend";
// import { ThoughtDB } from "vanjacloud.shared.js";
import { MicrophoneUI } from "./microphone";

import { Thought, AzureTranslate } from "vanjacloud.shared.js";


let thoughtdb: Thought.ThoughtDB = null;
let translator: AzureTranslate = null;

const isDevelopment = process.env.NODE_ENV == 'development';

console.log('isDev', isDevelopment)

function initThoughtDb(notionkey: string, db: string) {
  if (notionkey == null || notionkey == undefined) {
    console.warn('no notion key');
    alert('no notion key')
    return;
  }
  thoughtdb = new Thought.ThoughtDB(notionkey, db)
}

function getThoughtDb() {
  return thoughtdb;
}

function TranslationView(props: { translation?: Translation[] }) {
  const { translation } = props;
  if (translation == null) {
    return null;
  }
  return (<>
    <h3>Translation</h3>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 6fr', gridGap: '10px' }}>
      {translation.map((t) => (
        <React.Fragment key={t.to} >
          <div style={{ fontWeight: 'bold' }} key={t.to}>{t.to.slice(0, 2)}</div>
          <div key={t.to + '-text'}>{t.text}</div>
        </React.Fragment>
      ))}
    </div>
  </>)
}

function getHashTags(text) {
  const regex = /#[a-zA-Z0-9]+/g;
  const matches = text.match(regex);
  if (matches) {
    return matches;
  } else {
    return [];
  }
}


const NUM_MODES = 3; // todo: this is gone..

import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { TabView } from './TabView';
import { Translation } from 'vanjacloud.shared.js/dist/src/AzureTranslate';

const defaultHashtags = [
  '#work', '#idea', '#app', '#tweet', '#ai', '#lyrics', '#writing', '#name',
  '#tiktok', '#blog', '#guitar', '#code', '#story', '#tinder', '#croatia',
  '#thinking', '#girl', '#moment', '#experiment', '#business', '#comedy',
  '#song', '#reminisce', '#play', '#sex', '#leadership', '#spanish', '#manager',
  '#eaccsupremacy', '#matrix', '#wyd', '#feel', '#people', '#quality',
  '#workblog', '#test', '#edit', '#life', '#cringe', '#blogging', '#link',
  '#brettvictor', '#architecture', '#danger', '#feeling', '#mood',
  '#singing', '#content', '#coulddo', '#shoulddo', '#followup', '#quote'
]

function generateCompletionList(tags, limit = 5) {
  const completionList = {};
  tags.forEach(tag => {
    for (let i = 1; i <= tag.length; i++) {
      const prefix = tag.slice(0, i);
      if (!completionList[prefix]) {
        completionList[prefix] = [];
      }
      if (completionList[prefix].length < limit) {
        completionList[prefix].push(tag);
      }
    }
  });
  return completionList;
}

const completions = generateCompletionList(defaultHashtags);




function MyApp() {
  const [text, setText] = useState('Piensalo...');
  const [isSpinning, setIsSpinning] = useState(false);
  const [translation, setTranslation] = useState<Translation[]>();
  const [mode, setMode] = useState(0);

  const handleKeyDownGlobal = (event) => {
    if (event.key === 'Escape') {
      console.log('escape pressed');
      event.preventDefault();
      setTranslation(null);
      setMode(0)
    }

    // this doesnt work because mode is snapshotted welp
    if (event.metaKey && event.shiftKey) {
      if (event.key === '[') {
        let newMode = mode == 0 ? NUM_MODES - 1 : mode - 1;
        console.log('down mode', newMode, mode)
        setMode(newMode);
      } else if (event.key === ']') {

        let newMode = mode == NUM_MODES - 1 ? 0 : mode + 1;
        console.log('up mode', newMode, mode)
        setMode(newMode);

      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownGlobal);

    return () => {
      document.removeEventListener('keydown', handleKeyDownGlobal);
    };
  }, []);

  async function save(msg: string) {

    setIsSpinning(true)
    try {
      await getThoughtDb().saveIt2(msg, Thought.ThoughtDB.ThoughtType.note, getHashTags(msg));
    } catch (e) {
      console.log('saveIt failed', e, msg);
      alert('saveIt failed');
    }
    setIsSpinning(false)
  }

  async function onSave() {
    await save(text);
    setText('')
  }

  async function onTranslate() {
    setIsSpinning(true)
    const r1 = await translator.translate(text);
    setIsSpinning(false)
    setTranslation(r1)
    const r = await getThoughtDb().saveTranslation(r1)
  }


  const inputRef = useRef(null);

  useEffect(() => {
    // inputRef?.current?.select();
  }, []);


  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter' && event.metaKey) {
      /* show message box */

      console.log('enter pressed');

      event.preventDefault();
      if (event.shiftKey) {
        await onTranslate();
      } else {
        await save(text);
        setText('')
      }
      // inputRef.current.blur();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col flex-grow box-border rounded shadow-lg p-4
            font-sans m-auto p-8 bg-blue-100 text-gray-800 h-full w-full" >
        <TabView names={['main', 'mic']} activeTabIndex={mode}>

          {
            translation != null ? <TranslationView translation={translation} />
              : <div className="flex flex-col h-full w-full">
                {isDevelopment && <h2 className="text-red-600 font-bold">DEVELOPMENT</h2>}

                <TextInput
                  trigger={Object.keys(completions)}
                  options={completions}
                  ref={inputRef}
                  autoFocus
                  onKeyDown={handleKeyDown}

                  text={text}
                  onChange={(text) => setText(text)}
                  className={`resize-none overflow-auto transition-all duration-500 flex-grow w-full box-content ${isSpinning ? 'blur' : ''}`}
                />

                <div className="flex justify-around py-2 w-full">
                  <button onClick={onSave}>save</button>
                  <button onClick={onTranslate}>translate</button>
                </div>
              </div>
          }
          <MicrophoneUI backend={backend} />
        </TabView>
      </div>

    </div>
  );


}


function render() {


  const element = document.getElementById('root');
  console.log(element)
  ReactDOM.createRoot(
    // document.body
    element
  )
    .render(<>
      <MyApp />
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


async function init() {
  const r = await backend.request('', 'GetNotionInfo');
  console.log('cwd', r.cwd);
  initThoughtDb(r.notionkey, r.dbid);
  translator = new AzureTranslate(r.azureTranslateKey);
  console.log(r.azureTranslateKey)
}

init();
render();