import React, {useEffect, useState} from 'react';

import './App.css';
import { Widget, addResponseMessage, toggleWidget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

function App() {
    const [fullScreenMode, setFullScreenMode] = useState(false);

    useEffect(() => {
        toggleWidget()
    }, []);

    const handleNewUserMessage = (newMessage) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newMessage })
        };
        fetch('http://localhost:8081/chat', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("response: " + JSON.stringify(data))
                addResponseMessage(data.message)
            });

    };
    return (
        <div className="App">
            <Widget
                title="Amirs Chat Bot"
                subtitle="Schreib ins Web und bekomme Antworten von der Telegram API"
                handleNewUserMessage={handleNewUserMessage}
                fullScreenMode={true}
                showCloseButton={false}
            />
        </div>
    );
}

export default App;
