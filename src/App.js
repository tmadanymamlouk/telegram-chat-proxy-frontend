import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useCookies} from "react-cookie";
import './App.css';
import {Widget, addResponseMessage, addUserMessage, toggleWidget} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import uuid from 'react-uuid'

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const host = window.location.href

    useEffect(() => {
        toggleWidget()
        if (!cookies['userId']) {
            setCookie('userId', uuid())
        }
        handleNewUserMessage("start")
    }, []);

    const processServerResponse = (message) => {
        console.log("response message: " + message)
        addResponseMessage(message)
    }

    const showButtons = buttons => {
        document.getElementsByClassName("rcw-new-message")[0].classList.add('hidden');
        document.getElementsByClassName("rcw-send")[0].classList.add('hidden');

        const divNode = document.createElement("DIV");
        divNode.setAttribute('id', 'buttonWrapper')
        ReactDOM.render(buttons.map(button => {
            return (
                <Button
                    key={button}
                    name={button}
                    variant="primary"
                    className="clickButton"
                    onClick={(e) => {
                        console.log(e.target.name)
                        addUserMessage(e.target.name)
                        handleNewUserMessage(e.target.name)

                        document.getElementById("buttonWrapper").remove()

                        document.getElementsByClassName("rcw-new-message")[0].classList.remove('hidden');
                        document.getElementsByClassName("rcw-send")[0].classList.remove('hidden');

                    }}>
                    {button}
                </Button>
            )
        }), divNode)
        document.getElementsByClassName("rcw-sender")[0].appendChild(divNode)
    }

    const handleNewUserMessage = (newMessage) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: newMessage, userId: cookies['userId']})
        };
        fetch(host + '/chat', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("response: " + JSON.stringify(data))
                processServerResponse(data.message)
                if (data.buttons && data.buttons.length > 0)
                    showButtons(data.buttons)
            });

    };
    return (
        <div className="App">
            <Widget
                title="Amirs Chat Bot"
                subtitle=""
                handleNewUserMessage={handleNewUserMessage}
                fullScreenMode={false}
                showCloseButton={false}
            />
        </div>
    );
}

export default App;
