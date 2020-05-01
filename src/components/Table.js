import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import MaterialTable from 'material-table';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { enterTheme } from '../themes/Theme.js';
import history from "../utilities/history";
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from "react-router-dom";
const ENDPOINT = "http://127.0.0.1:8090";
const socket = io(ENDPOINT);



export default function Table({rooms, props}) {
  const socketRef = useRef(false);
  const classes = enterTheme(props);
  const [tableData, setTabledata] = useState(rooms);
  const [roomData, setRoomData] = useState();
  const [currRoom, updateCurrRoom] = useState(false);
  const [state, setState] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Type', field: 'type' },
      { title: 'Topic', field: 'topic' },
      { title: '', field: 'enter', render: rowData => <ArrowForwardIcon className={classes.root} onClick={() => updateCurrRoom(rowData)}></ArrowForwardIcon>},
    ],
    data: tableData
  });

  useEffect(() => {
    socket.on('new_room', function (data) {
      setState(prevState => ({ ...prevState, data: data}));
    })

    return () => {
      socket.off('new_room');
    }
  }, [])

  useEffect(() => {
    if (socketRef.current) {
      socket.emit('update_rooms', tableData, roomData, socketRef.current)
      socketRef.current = false;
    }
  }, [tableData, roomData])

  return (
    <div>
      {currRoom  ?
        <Redirect
          to={{
            pathname: `/room:${currRoom.uuid}`
          }}/> : null}
          <MaterialTable
            title="Chat Rooms"
            columns={state.columns}
            data={state.data}
            editable={{
              onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setState((prevState) => {
                    socketRef.current = "create";
                    newData.uuid = uuidv4();
                    const data = [...prevState.data];
                    data.push(newData)
                    setTabledata(data);
                    setRoomData(prevState => ({...prevState, messages: [], uuid: newData.uuid}));
                    return { ...prevState, data };
                  });
                }, 600);
              }),
              onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    setState((prevState) => {
                      socketRef.current = "update";
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      setTabledata(data);
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
              onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setState((prevState) => {
                    socketRef.current = "delete";
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    setTabledata(data);
                    setRoomData(prevState => ({...prevState, uuid: oldData.uuid}));
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            }}
          />
        </div>
      );
    }
