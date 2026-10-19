import React from "react";
import logoImg from "../assets/logo.png";

export default function Logo({ className = "h-11 md:h-14" }) {
  return (
    <img 
      src={logoImg} 
      alt="wewithyou Logo" 
      className={`object-contain select-none transition-all duration-300 mix-blend-multiply dark:invert dark:mix-blend-screen ${className}`}
      style={{ width: "auto" }}
    />
  );
}
