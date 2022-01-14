import React, { useState } from "react";
import "./App.css";
import LinearIndeterminate from "./Components/LinearIndeterminate";
import LayoutServices from "./Services/layoutServices";
import NotificationsComponent from "./Components/notificationsComponent";
import { useSelector, useDispatch } from 'react-redux';

function App(){
  const isRequest = useSelector((state) => state.isRequest)
  
  return (
    <div className="App">
      {
        isRequest&&<LinearIndeterminate/>
      }
      <header className="App-header">
          
      <LayoutServices/>

      <NotificationsComponent/>
      </header>{" "}
      
    </div>
  );
}

export default App;
