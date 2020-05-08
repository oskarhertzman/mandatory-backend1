import React, {useState, useEffect, useRef, useCallback, createRef } from 'react';
import Loader from 'react-loader-spinner'
import debounce from "lodash/debounce";
import io from 'socket.io-client';
import { Paper } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import FormDialog from '../components/Dialog.js';
import { paperTheme } from '../themes/Theme.js';
import { inputTheme, DotTheme } from '../themes/Theme.js';
import nav from '../utilities/nav';
import time from '../utilities/time';
import '../styles/Rooms.scss';

const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);
nav(window.location.pathname)


export default function Room(props) {
  const [room, updateRoom] = useState({name: '', messages: [], users_online: []});
  const [name, updateName] = useState({name: ''});
  const [message, updateMessage] = useState({message: ''});
  const [meTyping, setMeTyping] = useState(false);
  const [themTyping, setThemTyping] = useState(false);
  const [timeMsg, setTimeMsg] = useState();
  const [error, setError] = useState(false);
  const inputRef = useRef();
  const messagesEndRef = useRef(null)
  const serverRef = useRef(false);
  const debounceLoadData = useCallback(debounce(() => {
    setMeTyping(false);
  }, 3000), []);

  const inputThemes = inputTheme();
  const uuid = window.location.pathname.split(':')[1];
  const hr = (new Date()).getHours();

  const [nameRefs, setNameRefs] = useState([]);
  const [msgRefs, setMsgRefs] = useState([]);

  useEffect(() => {
    time(hr, function (data) {
      setTimeMsg(data);
    })
    socket.emit('join_room', uuid);
    socket.on('get_room', function (response) {
      if(response.error_404){
        setError(response.error_404);
      }
      else {
        updateRoom(response)

        setNameRefs(nameRefs => (
          Array(response.messages.length).fill().map((_, i) => nameRefs[i] || createRef())
        ));
        setMsgRefs(msgRefs => (
          Array(response.messages.length).fill().map((_, i) => msgRefs[i] || createRef())
        ));
      }
    })
    socket.on('new_message', function (data) {
      updateRoom(prevState => ({...prevState, messages: [...prevState.messages, data]}));
      serverRef.current = false;
    })
    socket.on('delete_message', function (data) {
      updateRoom(prevState => ({...prevState, messages: data}))
    })
    socket.on('user_joined', function (data) {
      console.log("USER JOINED");
      updateRoom(prevState => ({...prevState, users_online: [...prevState.users_online, data]}));
    })
    socket.on('user_left', function (data) {
      console.log("USER LEFT");
      updateRoom(prevState => ({...prevState, users_online: data}));
    })
    socket.on('typing', function (data) {
      setThemTyping(data.typing);
    })

    return () => {
      socket.off('get_room');
      socket.off('new_message');
      socket.off('delete_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('typing');
    }
  }, [uuid, hr])

  useEffect(() => {
    if (name.name) {
      updateRoom(prevState => ({...prevState, users_online: [...prevState.users_online, {name: name.name}]}));
      socket.emit('user_joined', {name: name.name}, uuid)
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [name.name, uuid]);

  useEffect (() => {
    if (meTyping) {
      socket.emit('typing', {typing: meTyping})
    }
    else {
      socket.emit('typing', {typing: meTyping})
    }
  },[meTyping])

  useEffect(() => {
    setNameRefs(nameRefs => (
      Array(room.messages.length).fill().map((_, i) => nameRefs[i] || createRef())
    ));
    setMsgRefs(msgRefs => (
      Array(room.messages.length).fill().map((_, i) => msgRefs[i] || createRef())
    ));
    if (name.name) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }
},[room, name.name])

  function sendMessage(e) {
    e.preventDefault();
    setMeTyping(false);
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    inputRef.current.value = '';
    const merged = {...name, ...message}
    socket.emit('new_message', merged, uuid)
    updateRoom(prevState => ({...prevState, messages: [...prevState.messages, merged]}));
  }

  function onMessageChange (e) {
    let target = e.target.value
    console.log(inputRef.current.value);
    updateMessage(prevState => ({...prevState, message: target}));
    setMeTyping(true)
    debounceLoadData();
  }

  function deleteMessage(name, message) {
    socket.emit('delete_message', {
      name: name.current.textContent,
      message: message.current.textContent,
    }, uuid)
    let newRoom = room.messages;
    for (let [index,usr] of room.messages.entries()) {
      if (usr.name === name.current.textContent && usr.message === message.current.textContent) {
        newRoom.splice(index, 1);
        break;
      }
    }
    updateRoom(prevState => ({...prevState, messages: newRoom}))
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
                      key={index}
                      id={index}
                      >
                        <p ref={msgRefs[index]} className="Room__container__main__center__chat__message__message">{message.message}</p>
                        <p ref={nameRefs[index]} className="Room__container__main__center__chat__message__name">{message.name}</p>
                        {name.name === message.name ? <div className="delMessage" onClick={ () => deleteMessage(nameRefs[index], msgRefs[index])}><DeleteIcon /></div> : null}
                      </div>
                    )
                  })}
                  {themTyping ?
                    <Loader
                      className="typingLoader"
                      type="ThreeDots"
                      color={DotTheme}
                      height={80}
                      width={80} /> : null}
                      <div id="scrollRef" ref={messagesEndRef} />
                    </div>
                    <div className="Room__container__main__center__user">
                      <form onSubmit={sendMessage}>
                        <TextField
                          inputRef={inputRef}
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
                      <h3>{timeMsg}, {name.name}</h3>
                    </div>
                    <div className="Room__container__main__right__users">
                      <h3>Online now</h3>
                      {room.users_online.map((usersOnline, index) => {
                        return (
                          <div key={index} className="Room__container__main__right__users__online">
                            <p>{usersOnline.name}</p>
                            <div className="circle"></div>
                          </div>
                        )
                      })}
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
            /> : null
          }
        </div>
      );
    }
