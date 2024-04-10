import QRCode from 'qrcode.react';
import './QRCodeGen.css'; // Import CSS file for styling
import React, { useEffect, useState } from 'react';

function QRCodeGen( {setQRCode, isQRCode}) {
  const websiteLink = 'https://anorakthegreat.github.io/WoodsideBell/'; // Replace with your specific web link
  const [qrSize, setQrSize] = useState(175); // Initial size of QR code

  // Function to update QR code size based on window width
  const updateQrSize = () => {
    if(window.innerWidth > 700){
      setQrSize(175);
    } else {
      setQrSize(100)
    }
  };

  // Update QR code size on initial render and when window is resized
  useEffect(() => {
    updateQrSize();
    window.addEventListener('resize', updateQrSize);
    return () => {
      window.removeEventListener('resize', updateQrSize);
    };
  }, []);

  const handleClick = () => {
    setQRCode(false)
    console.log(isQRCode)
  }
  return (
    
    <div className='cont'>

      <div class = "text-container">
        <a href="#" onClick={handleClick} className="heading-link">

          <h4 className="heading" >Woodside High School Bell Schedule</h4>
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
            <QRCode value={websiteLink}  size={qrSize}/>

        </div>
      </div>
    </div>
    </div>
    
  );
}

export default QRCodeGen;