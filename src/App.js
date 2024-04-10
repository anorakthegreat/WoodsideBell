import logo from './logo.svg';
import './App.css';
import SchoolBell from './SchoolBell';
import QRCodeGen from './QRCodeGen';
import React, { useEffect, useState } from 'react';

function App() {
  const [isQRCode, setQRCode] = useState(false);

  const renderSwitch = (qr) =>{
    if(qr == true){
      return (    
        <QRCodeGen 
          setQRCode={setQRCode}
          isQRCode={isQRCode}
        />
      );
    } else {
      return(
        <SchoolBell
          setQRCode={setQRCode}
          isQRCode={isQRCode}
        />
      )
      
    }

  }
  return (

    // <SchoolBell/>

    <div className="App">
      {renderSwitch(isQRCode)}

    </div>
  );
}

export default App;
