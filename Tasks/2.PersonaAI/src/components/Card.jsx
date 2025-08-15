import React from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setPersona } from "../app/slice";

function Card(props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const proceedToChat = (id) => {
        dispatch(setPersona(id))
        navigate(`/chat`)
    }
  return (
    <>
      <div onClick={()=>{proceedToChat(props.id)}} className="lg:col-span-4 col-span-12 p-4 flex flex-row gap-4 items-center bg-white/20 backdrop-blur-lg rounded-2xl cursor-pointer hover:bg-white/40 transition-all">
        <div className="thumbnail rounded-full overflow-hidden lg:w-[200px] lg:h-[200px] md:w-[200px] md:h-[200px] w-[180px] h-[180px]">
          <img src={props.image} alt="Image" className="w-full h-full" />
        </div>
        <div className="">
          <h5 className="orbitron-600 text-white md:text-2xl">{props.name}</h5>
          <p className="roboto-400 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            {props.profession}
          </p>
        </div>
      </div>
    </>
  );
}

export default Card;
