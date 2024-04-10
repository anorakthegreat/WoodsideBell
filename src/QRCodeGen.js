import React from 'react';
import QRCode from 'qrcode.react';
import './QRCodeGen.css'; // Import CSS file for styling

function QRCodeGen( {setQRCode, isQRCode}) {
  const websiteLink = 'https://anorakthegreat.github.io/WoodsideBell/'; // Replace with your specific web link
  
  const handleClick = () => {
    setQRCode(false)
    console.log(isQRCode)
  }
  return (
    
    <div className='cont'>

      <div class = "text-container">
        <a href="#" onClick={handleClick} className="heading-link">

          <h2 className="heading" >Woodside High School Bell Schedule</h2>
        </a>

      </div>
      
      <div className="button-container">
        <button onClick={handleClick} className="button">X</button>
      </div>

    <div className="container">
      <div className="bordered-wrapper">
        <div className="content">

            <h4>Scan Me!</h4>


            {/* <QRCode value={websiteLink} /> */}
            <QRCode value={websiteLink} size={175} />

        </div>
      </div>
    </div>
    </div>
    
  );
}

export default QRCodeGen;