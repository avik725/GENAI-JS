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
      <div onClick={()=>{proceedToChat(props.id)}} className="col-span-4 p-4 flex flex-row gap-4 items-center bg-white/20 backdrop-blur-lg rounded-2xl cursor-pointer hover:bg-white/40 transition-all">
        <div className="thumbnail rounded-full overflow-hidden w-[200px] h-[200px]">
          <img src={props.image} alt="Image" className="w-full h-full" />
        </div>
        <div className="">
          <h5 className="orbitron-600 text-white">{props.name}</h5>
          <p className="roboto-400 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            {props.profession}
          </p>
        </div>
      </div>
    </>
  );
}

export default Card;
