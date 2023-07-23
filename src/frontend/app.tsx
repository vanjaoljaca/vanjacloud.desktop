import * as ReactDOM from 'react-dom/client';
import React, { useEffect, useRef, useState } from 'react';
import { IBackend } from "../shared/IBackend";
// import { ThoughtDB } from "vanjacloud.shared.js";
import { Translator } from "../shared/translate";
import { MicrophoneUI } from "./microphone";

import * as vanjacloud from "vanjacloud.shared.js";
const ThoughtDB = (vanjacloud.default as any).ThoughtDB;


let thoughtdb: any = null;
let translator: Translator = null;

const isDevelopment = process.env.NODE_ENV == 'development';

console.log('isDev', isDevelopment)

function initThoughtDb(notionkey: string, db: string) {
    if (notionkey == null || notionkey == undefined) {
        console.warn('no notion key');
        alert('no notion key')
        return;
    }
    thoughtdb = new ThoughtDB(notionkey, db)
}

function getThoughtDb() {
    return thoughtdb;
}

function TranslationView(props: { translation?: string[2][] }) {
    const { translation } = props;
    if (translation == null) {
        return null;
    }
    return <>
        <h3>Translation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 6fr', gridGap: '10px' }}>
            {translation.map(([text, lang]) => <>
                <div style={{ fontWeight: 'bold' }} key={lang}>{lang.slice(0, 2)}</div>
                <div key={lang + '-text'}>{text}</div>
            </>
            )}
        </div>
    </>
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


const NUM_MODES = 3;

import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

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
    const [translation, setTranslation] = useState<string[2][]>();
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
            await getThoughtDb().saveIt2(msg, ThoughtDB.ThoughtType.note, getHashTags(msg));
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
        setTranslation(r1.map((r: any) => [r.text, r.to]))
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

    if (translation != null) {
        return <TranslationView
            translation={translation} />
    }

    if (mode == 1) {
        return <MicrophoneUI backend={backend} />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', boxSizing: 'border-box' }}>
            {isDevelopment && <h2>DEVELOPMENT</h2>}

            <TextInput
                trigger={Object.keys(completions)}
                //defaultHashtags
                options={completions}
                ref={inputRef}
                autoFocus
                onKeyDown={handleKeyDown}

                text={text}
                onChange={(text) => setText(text)}
                style={{
                    filter: isSpinning ? 'blur(5px)' : '',
                    flex: '1 1 auto', // This makes the textarea grow and shrink as needed
                    margin: '1em',
                    resize: 'none',
                    boxSizing: 'border-box', // Include padding and border in width and height
                    overflow: 'auto', // Add scrollbars if the content overflows
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '1em' }}>
                <button onClick={onSave}>save</button>
                <button onClick={onTranslate}>translate</button>
            </div>
        </div>
    );


}


function render() {


    ReactDOM.createRoot(
        // document.body
        document.getElementById('root')
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
    translator = new Translator(r.azureTranslateKey);
    console.log(r.azureTranslateKey)
}

init();
render();