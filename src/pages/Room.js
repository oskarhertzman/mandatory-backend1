import React, {useState, useEffect, useRef, useCallback } from 'react';
import Loader from 'react-loader-spinner'
import debounce from "lodash/debounce";
import io from 'socket.io-client';
import { Paper } from '@material-ui/core';
import { TextField } from '@material-ui/core';



import FormDialog from '../components/Dialog.js';
import { paperTheme } from '../themes/Theme.js';
import { inputTheme, DotTheme } from '../themes/Theme.js';
import nav from '../utilities/nav';
import '../styles/Rooms.scss';

const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);
nav(window.location.pathname)


export default function Room(props) {
  const [room, updateRoom] = useState({name: '', messages: []});
  const [name, updateName] = useState({name: ''});
  const [message, updateMessage] = useState({message: ''});
  const [referance, setReferance] = useState(false);
  const [meTyping, setMeTyping] = useState(false);
  const [themTyping, setThemTyping] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef(null)
  const serverRef = useRef(false);
  const debounceLoadData = useCallback(debounce(() => {
    setMeTyping(false);
  }, 3000), []);
  const inputThemes = inputTheme();
  const uuid = window.location.pathname.split(':')[1];

  useEffect(() => {
    socket.emit('join_room', uuid);

    socket.on('get_room', function (response) {
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
      console.log(data);
      updateRoom(prevState => ({...prevState, messages: [...prevState.messages, data]}));
      serverRef.current = false;
    })
    socket.on('typing', function (data) {
      setThemTyping(data.typing);
    })

    socket.on('joined', function (data) {
      console.log(data);
    })

    return () => {
      socket.off('get_room');
      socket.off('new_message');
      socket.off('typing');
      socket.off('joined');
    }
  }, [uuid])

  useEffect(() => {
    if (name.name) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

  useEffect (() => {
    if (meTyping) {
      socket.emit('typing', {typing: meTyping, room: room.name})
    }
    else {
      socket.emit('typing', {typing: meTyping, room: room.name})
    }
  },[meTyping])


  function sendMessage(e) {
    e.preventDefault();
    setMeTyping(false);
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    const merged = {...name, ...message}
    console.log(merged);
    socket.emit('new_message', merged, uuid)
    updateRoom(prevState => ({...prevState, messages: [...prevState.messages, merged]}));
  }

  function onMessageChange (e) {
    let target = e.target.value
    console.log(target);
    updateMessage(prevState => ({...prevState, message: target}));
    setMeTyping(true)
    debounceLoadData();
  }

  return (
    <div className="Room">
      {error || !name.name ? null :
        <div className="Room__container">
          <Paper style={paperTheme.paper} elevation={3} >
            <div className="Room__container__header">
            </div>
            <div className="Room__container__main">
              <div className="Room__container__main__left">
                <h1 className="title">{room.name}</h1>

              </div>
              <div className="Room__container__main__center">
                <div className="Room__container__main__center__header">
                  <h1>Discuss {room.topic}</h1>
                </div>
                <div className="Room__container__main__center__chat">
                  {room.messages.map((message, index) => {
                    return (
                      <div className={["Room__container__main__center__chat__message bubble",
                        index + 1,
                        (name.name === message.name ? "me" : "you")]
                        .join(' ')}
                        key={index}>
                        <p className="Room__container__main__center__chat__message__message">{message.message} </p>
                        <p className="Room__container__main__center__chat__message__name">{message.name} </p>
                      </div>
                    )
                  })}
                  {themTyping ?
                    <Loader
                      type="ThreeDots"
                      color={DotTheme}
                      height={80}
                      width={80} /> : null}
                    <div id="scrollRef" ref={messagesEndRef} />
                  </div>
                  <div className="Room__container__main__center__user">
                    <form onSubmit={sendMessage}>
                      <TextField
                        autoFocus={true}
                        autoComplete="off"
                        className={inputThemes.message}
                        id="standard-basic" label="Message" variant="standard"
                        onChange={onMessageChange}
                        required={true}
                        onKeyPress={(ev) => {
                          if (ev.key === 'Enter') {
                            ev.preventDefault();
                            sendMessage(ev);
                          }
                        }}
                      />
                    </form>
                  </div>
                </div>

                <div className="Room__container__main__right">
                  <div className="Room__container__main__right__user">
                    <p>{name.name}</p>
                  </div>
                  <div className="Room__container__main__right__users">

                  </div>
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
