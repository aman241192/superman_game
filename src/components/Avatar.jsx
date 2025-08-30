// import React from "react";
import flyingHero from "../assets/images/flyingHero.png";
import standingHero from "../assets/images/standingHero.png";

const Avatar = ({ x, y, move }) => {
  return (
    <div
      className="absolute w-[150px] h-[150px] rounded-full"
      style={{
        left: x,
        top: y, // Now properly uses the y prop
        transform: move ? "rotate(-20deg)" : "none",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div className="w-full h-full object-fill rounded-full flex items-center justify-center text-6xl">
        <img
          src={move ? flyingHero : standingHero}
          className="w-full h-full object-contain "
        />{" "}
      </div>
    </div>
  );
};
export default Avatar;
