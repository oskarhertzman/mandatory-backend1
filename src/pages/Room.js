import React, {useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { Paper } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

import FormDialog from '../components/Dialog.js';
import { paperTheme } from '../themes/Theme.js';
import { inputTheme } from '../themes/Theme.js';
import nav from '../utilities/nav';
import '../styles/Rooms.scss';

const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);
nav(window.location.pathname)

function useHookWithRefCallback() {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
    }

    // Save a reference to the node
    ref.current = node
  }, [])

  return [setRef]
}

export default function Room(props) {
  const [room, updateRoom] = useState({name: '', messages: []});
  const [name, updateName] = useState({name: ''});
  const [message, updateMessage] = useState({message: ''});
  const [referance, setReferance] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef(null)
  const serverRef = useRef(false);
  const classes = inputTheme();
  const uuid = window.location.pathname.split(':')[1];


  useEffect(() => {
    if (room.name.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])
  
  useEffect(() => {
    socket.emit('get_room', uuid, function (response) {
      console.log(response);
      if(response.error_404){
        setError(response.error_404);
        if (response.referance) {
          setReferance(response.referance[0]);
        }
      }
      else {
        updateRoom(response[0])
      }
    })
    socket.on('new_message', function (data) {
      updateRoom(prevState => ({...prevState, messages: [...prevState.messages, data]}));
      serverRef.current = false;
    })
    return () => {
      socket.off('new_message');
    }
  }, [uuid])


  function sendMessage(e) {
    e.preventDefault();
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    const merged = {...name, ...message}
    socket.emit('new_message', merged, uuid)
    updateRoom(prevState => ({...prevState, messages: [...prevState.messages, merged]}));
  }

  function onMessageChange (e) {
    let target = e.target.value
    updateMessage(prevState => ({...prevState, message: target}));
  }


  return (
    <div className="Room">
      {error || !name.name ? null :
        <div className="Room__container">
          <Paper style={paperTheme.paper} elevation={3} >
            <div className="Room__container__header">
              <h1>{room.name}</h1>
            </div>
            <div className="Room__container__chat">
              {room.messages.map((message, index) => {
                return (
                  <div className={["Room__container__chat__message bubble", index + 1, (name.name === message.name ? "me" : "you")].join(' ')} key={index}>
                      <p>Message: {message.message} </p>
                      <p>Name: {message.name} </p>
                  </div>
                )
              })}
            <div ref={messagesEndRef} />
              </div>
            <div className="Room__container__user">
              <form onSubmit={sendMessage}>
                <TextField
                  autoFocus={true}
                  autoComplete="off"
                  className={classes.message}
                  id="outlined-basic" label="Message" variant="outlined"
                  onChange={onMessageChange}
                  required={true} />
                  <Button className={classes.button} type="submit" label="login" variant="contained" color="primary"><SendIcon /></Button>
                </form>
                <div className="Room__container__user__info">
                  <p>User: {name.name}</p>
                </div>
              </div>
            </Paper>
          </div>
        }
        {room.name || error ?
          <FormDialog
            name={name}
            room={room}
            updateName={updateName}
            error={error}
            server_ref={referance}
          /> : null
        }
      </div>
    );
  }
