import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import MaterialTable from 'material-table';

import NewPass from '../components/NewPass.js';
import { enterTheme } from '../themes/Theme.js';

export default function Table({rooms, socket, props}) {
  const socketRef = useRef(false);
  const typeRef = useRef(false);
  const classes = enterTheme(props);
  const [tableData, setTabledata] = useState(rooms);
  const [roomData, setRoomData] = useState();
  const [currRoom, updateCurrRoom] = useState(false);
  const [newPass, setNewPass] = useState(false);

  const [columns, setColumns] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Type', field: 'type', lookup: { Public: 'Public', Private: 'Private'}, editable: 'onAdd'},
      { title: 'Topic', field: 'topic' },
      { render: rowData => <ArrowForwardIcon className={classes.root} onClick={() => updateCurrRoom(rowData)}></ArrowForwardIcon>},
    ],
    data: tableData,
  });

  useEffect(() => {
    socket.on('new_room', function (data) {
      setColumns(prevState => ({ ...prevState, data: data}));
    })
    return () => {
      socket.off('new_room');
    }
  }, [rooms, socket, tableData])

  useEffect(() => {
    if (socketRef.current) {
      if (typeRef.current === 'public'
      || socketRef.current === 'update'
      || socketRef.current === 'delete') {
        socket.emit('update_rooms', tableData, roomData, socketRef.current, typeRef.current)
        socketRef.current = false;
      }
      else if (typeRef.current === 'private') {
        setNewPass(true);
      }
    }
  }, [tableData, roomData, socket])


  return (
    <div>
      {currRoom  ?
        <Redirect
          to={{
            pathname: `/room:${currRoom.uuid}`
          }}/> : null}
          <MaterialTable
            title="Chat Rooms"
            columns={columns.columns}
            data={columns.data}
            editable={{
              onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setColumns((prevState) => {
                    if(newData.type === "Public") {
                      socketRef.current = "create";
                      typeRef.current = "public";
                      newData.uuid = uuidv4();
                      const data = [...prevState.data];
                      data.push(newData)
                      setTabledata(data);
                      setRoomData(prevState => ({...prevState, name: newData.name, topic: newData.topic, type: newData.type, messages: [], uuid: newData.uuid, users_online: []}));
                      return { ...prevState, data };
                    }
                    else if (newData.type === "Private") {
                      socketRef.current = "create";
                      typeRef.current = 'private';
                      newData.uuid = uuidv4();
                      const data = [...prevState.data];
                      data.push(newData)
                      setTabledata(data);
                      setRoomData(prevState => ({...prevState, name: newData.name, topic: newData.topic, type: newData.type, messages: [], uuid: newData.uuid, users_online: []}));
                      return { ...prevState, data };
                    }
                    else {
                      alert('The Room type must be either "Public" or "Private"')
                      return { ...prevState}
                    }
                  });
                }, 600);
              }),
              onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  if (oldData) {
                    setColumns((prevState) => {
                      socketRef.current = "update";
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      setTabledata(data);
                      setRoomData(prevState => ({...prevState, name: newData.name, topic: newData.topic, type: newData.type, messages: [], uuid: newData.uuid, users_online: []}));
                      return { ...prevState, data };
                    });
                  }
                }, 600);
              }),
              onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  setColumns((prevState) => {
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
          {newPass ?
            <NewPass
              table={tableData}
              room={roomData}
            /> : null}
          </div>
        );
      }
