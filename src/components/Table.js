import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import MaterialTable, { MTableToolbar } from 'material-table';
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from "react-router-dom";
const ENDPOINT = "http://127.0.0.1:8090";

export default function Table({rooms}) {
  const socketRef = useRef(false);
  const [tableData, setTabledata] = useState(rooms);
  const [roomData, setRoomData] = useState();
  const [currRoom, updateCurrRoom] = useState(false);
  const socket = io(ENDPOINT);
  const [state, setState] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Type', field: 'type' },
      { title: 'Topic', field: 'topic' },
      { title: '', field: 'enter', render: rowData => <button onClick={() => updateCurrRoom(rowData)}>Enter </button>},
    ],
    data: tableData
  });



  useEffect(() => {
    if (socketRef.current) {
       socket.emit('update_rooms', tableData)
    }
  }, [tableData])


  useEffect(() => {
    if (socketRef.current === 'create') {
      socket.emit('create_room', roomData);
    }

    if (socketRef.current === 'delete') {
      console.log("yo");
      socket.emit('delete_room', roomData)
    }

  }, [roomData])



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
