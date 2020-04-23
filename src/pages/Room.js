import React, {useState, useEffect} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
const ENDPOINT = "http://127.0.0.1:8090";


function Room() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io(ENDPOINT);
    getMessages(socket);
  }, [])


  function getMessages (socket) {
    socket.on('FromAPI', (data) => {
      setResponse(data);
      console.log(data);
    });
  }

  function sendMessage() {

  }


  return (
    <div className="Room">
      <p>
      It's <time dateTime={response}>{response}</time>
    </p>
    </div>
  );
}

export default Room;
