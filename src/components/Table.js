import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import MaterialTable, { MTableToolbar } from 'material-table';
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from "react-router-dom";
const ENDPOINT = "http://127.0.0.1:8090";

export default function Table({rooms}) {
  const [tableData, setTabledata] = useState(rooms);
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


  function updateToDB (data) {
    console.log(data);
    socket.emit('update_rooms', data)
  }





  return (
    <div>
    {currRoom || currRoom === 0 ?
      <Redirect
        to={{
          pathname: `/room:${currRoom.uuid}`,
          state: { referrer: currRoom }
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
                newData.uuid = uuidv4();
                newData.messages = [];
                console.log(newData);
                const data = [...prevState.data];
                data.push(newData)
                console.log(data);
                updateToDB(data)
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
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  updateToDB(data);
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
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                updateToDB(data);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  </div>
  );
}
