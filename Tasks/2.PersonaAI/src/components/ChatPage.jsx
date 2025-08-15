import React, { useState } from "react";
import { useSelector } from "react-redux";
import { setPersona } from "../app/slice";
import { useDispatch } from "react-redux";
import ChatInterface from "./ChatInferface";

function ChatPage() {
  const dispatch = useDispatch();
  const personaas = useSelector((state) => state.personas);
  const currentPersona = useSelector((state) => state.currentPersona);
  const [personaDropdown, setPersonaDropdown] = useState(false);
  const changePersona = (id) => {
    dispatch(setPersona(id));
    setPersonaDropdown(false);
  };

  return (
    <>
      <section className="px-3 md:px-6 lg:px-6 pb-6 grow">
        <div className="flex flex-col bg-white/10 backdrop-blur-xs border border-white/20 rounded-4xl p-3 md:p-6 text-center h-full">
          <div className="relative">
            <button
              onClick={() => {
                setPersonaDropdown((prev) => !prev);
              }}
              className="orbitron-600 text-xl capitalize flex items-center justify-center text-white cursor-pointer"
            >
              <span className="rounded-full overflow-hidden w-[70px] h-[70px] inline-block me-4">
                <img
                  src={currentPersona.image}
                  alt="Image"
                  className="w-full h-full"
                />
              </span>
              {currentPersona.id}
              <span className="ms-4">
                <i className="fa-solid fa-chevron-down text-xl"></i>
              </span>
            </button>
            {personaDropdown && (
              <div className="inline-block absolute z-10 left-24 top-14 px-3 py-2 bg-white/20 rounded-4xl border border-white/60">
                {personaas?.map((persona, index) => (
                  <button
                    key={index}
                    onClick={() => changePersona(persona.id)}
                    className={`block orbitron-600 p-3 capitalize text-white cursor-pointer ${
                      persona.id === currentPersona.id
                        ? "bg-white/20 border border-white/50"
                        : ""
                    } rounded-4xl`}
                  >
                    {persona?.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-3 grow mt-4">
            <div className="lg:col-span-4 col-span-12 border border-white/30 bg-white/5 backdrop-blur-lg rounded-4xl p-4">
              <div className="p-[2px] bg-gradient-to-r from-pink-500/80 to-red-500/80 rounded-4xl lg:mb-3">
                <div className="bg-white/10 border border-white/40 flex justify-start gap-5 px-3 py-2 rounded-4xl">
                  <span className="rounded-full lg:w-[120px] lg:h-[120px] md:w-[110px] md:h-[110px] hidden  md:inline-block overflow-hidden">
                    <img
                      src={currentPersona.image}
                      alt="image"
                      className="w-full h-full rounded-full"
                    />
                  </span>
                  <div className="flex flex-col w-full md:w-auto lg:w-auto md:items-start lg:items-start justify-center md:mb-4 lg:mb-4">
                    <h5 className="orbitron-600 text-2xl text-white">
                      {currentPersona.name}
                    </h5>

                    <p className="roboto-600 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                      {currentPersona.profession}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block p-[2px] bg-gradient-to-r from-pink-500/80 to-red-500/80 rounded-4xl">
                <div className="bg-white/10 border border-white/40 rounded-4xl px-3 py-2">
                  <div className="text-white text-start mb-4">
                    {currentPersona?.introBulletPoints?.map((point) => (
                      <li key={point} className="capitalize">{point}</li>
                    ))}
                  </div>
                  <p className="text-justify text-white">
                    {currentPersona?.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 col-span-12 border border-white/30 bg-white/5 backdrop-blur-lg rounded-4xl">
              <ChatInterface currentPersona={currentPersona} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ChatPage;
