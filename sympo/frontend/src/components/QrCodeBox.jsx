import React from "react";
import QRCode from "react-qr-code";

const QRCodeBox = ({ value, size = 50, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <QRCode value={value} size={size} />
    </div>
  );
};

export default QRCodeBox;
