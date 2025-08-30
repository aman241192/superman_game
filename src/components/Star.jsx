import React from "react";
import krytonite from "../assets/images/krypto.jpg";

const Star = ({ x, y }) => {
  return (
    <div
      className="absolute rotate-180 w-[20px] h-auto"
      style={{
        left: x,
        top: y,
        backgroundColor: "green",
        boxShadow: "0 0 10px yellow",
      }}
    >
      <img src={krytonite} className="w-full h-full object-contain" />
    </div>
  );
};

export default Star;
