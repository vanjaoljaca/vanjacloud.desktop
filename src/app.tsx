import * as ReactDOM from 'react-dom';

//https://github.com/electron/electron-quick-start-typescript/tree/master/src

// import MyModule from 'vanjacloudjs.shared';

console.log('Hello from APP.TSX!');
// console.log(MyModule)
const MyModule = {
    myThing: 'Hello from MyModule!'
}

import React from 'react';
async function test() {
    return 'Hello from REACT!';
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
    const z = MyModule

    ReactDOM.render(<p>
        <h2>Hello from React!</h2>
        <h2>{z.myThing}</h2>
        <MyApp />
    </p>, document.body);
}

render();