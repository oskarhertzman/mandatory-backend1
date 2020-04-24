import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import MaterialTable, { MTableToolbar } from 'material-table';
const ENDPOINT = "http://127.0.0.1:8090";

export default function Table({rooms}) {
  const [tableData, setTabledata] = useState(rooms);
  const [socket] = useState(io(ENDPOINT))
  const [state, setState] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Type', field: 'type' },
      { title: 'Topic', field: 'topic' },
      { title: '', field: 'enter', render: rowData => <button>Enter </button>},
    ],
    data: tableData
  });



  function updateDB (data) {
    console.log(data);
    socket.emit('im a client', data)
  }

  return (
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
                const data = [...prevState.data];
                data.push(newData);
                updateDB(data)
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
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}
