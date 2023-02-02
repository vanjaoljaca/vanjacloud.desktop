import * as ReactDOM from 'react-dom';

//https://github.com/electron/electron-quick-start-typescript/tree/master/src


import React from 'react';
async function test() {
    return 'Hello from Notion!';
}

function MyApp() {
    const [text, setText] = React.useState('Loading...');
    React.useEffect(() => {
        test().then((text) => {
            setText(text);
        })
    }, []);
    return <h2>{text}</h2>;
}

function render() {
    ReactDOM.render(<p>
        <h2>Hello from React!</h2>
        <MyApp />
    </p>, document.body);
}

render();