import React from "react";
import { useLocation, useNavigate, useParams } from "react-router";

function Header() {
  const location = useLocation();
  const navigate = useNavigate()
  const { currentPersona } = useParams();

  return (
    <>
      <section className="px-6 py-4">
        <div className="flex justify-between items-center bg-white/10 backdrop-blur-xs border border-white/20 rounded-full px-10 py-4">
          <div className="inline-block cursor-pointer" onClick={()=> navigate("/")}>
            <p className="orbitron-600 text-2xl bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Persona AI
            </p>
          </div>
          {location.pathname.includes("chat") && (
            <>
              <div>
                <button className="">{currentPersona}</button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Header;
