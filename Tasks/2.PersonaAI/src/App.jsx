import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import "@fontsource/orbitron";
import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/600.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/600.css";
import { Header } from "./components";
import { Outlet } from "react-router";

function App() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
