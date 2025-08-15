import React from "react";
import Card from "./Card";
import { useSelector, useDispatch } from "react-redux";

function Home() {
  const personas = useSelector((state) => state.personas);
  return (
    <>
      <section className="lg:px-6 pb-6 px-3 h-[calc(100vh-100px)]">
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-4xl lg:p-6 p-3">
          <h1 className="orbitron-600 text-2xl mb-6 text-center text-white">
            Select Your Persona
          </h1>
          <div className="grid grid-cols-12 lg:px-10 px-3 gap-5">
            {personas?.map((persona, index) => (
              <Card
                key={index}
                id={persona.id}
                image={persona.image}
                profession={persona.profession}
                name={persona.name}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
