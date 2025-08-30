// import React from "react";
import flyingHero from "../assets/images/flyingHero.png";
import standingHero from "../assets/images/standingHero.png";
const Avatar = ({ x, move }) => {
  return (
    <div
      className="absolute w-[150px] h-[150px] rounded-full top-0 bottom-0 m-auto"
      style={{
        left: x,
        transform: move ? "rotate(-20deg)" : "none",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div
        className="w-full h-full object-fill  flex items-center justify-center text-6xl"
        // style={{
        //   background: move
        //     ? "linear-gradient(45deg, #ff6b6b, #4ecdc4)"
        //     : "linear-gradient(45deg, #74b9ff, #0984e3)",
        // }}
      >
        <img
          src={move ? flyingHero : standingHero}
          className="w-full h-full object-contain "
        />
      </div>
    </div>
  );
};

export default Avatar;
