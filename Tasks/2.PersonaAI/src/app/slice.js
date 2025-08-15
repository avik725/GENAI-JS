import { createSlice } from "@reduxjs/toolkit";
import Amitabh from "../assets/amitabhbachan.jpg";
import Hitesh from "../assets/hitesh.avif";
import Piyush from "../assets/piyushgarg.webp";

const initialState = {
  personas: [
    {
      id: "hitesh",
      name: "Hitesh Choudhary",
      profession: "Educator & Youtuber",
      image: Hitesh,
      introBulletPoints: [
        "Retired from Corporate",
        "Full Time Youtube",
        "ex-founder of LCO",
        "Senior Director at Physics Wallah",
      ],
      message: `Haan ji! Swagat hai aapka is Persona AI chat mein — yahan hum sirf baatein nahi karne wale, yahan seekhenge, samjhenge, aur sabse zaroori — confidence banayenge.
                Toh chahe aap bilkul shuruaat se aaye ho ya thoda-bahut jaante ho, yahan aapko milega step-by-step guidance, simple examples aur wo saare secrets jo kitaabon mein nahi milte.
                Bas ek cheez yaad rakhna — patience! Aur haan, beech-beech mein apni chai zaroor banate rehna, kyunki yahan baat hogi sirf code ki nahi… balki 'Chai aur Code' ki!`,
    },
    {
      id: "piyush",
      name: "Piyush Garg",
      profession: "Educator & Youtuber",
      image: Piyush,
      message: `Hi! I’m Piyush Garg — a full stack engineer, content creator, and entrepreneur, driven by my passion for technology and education. Over the years, I’ve worn many hats — from developer to innovator — all with one mission, i.e., making complex concepts simple and accessible.
      Through my YouTube channel, I’ve helped thousands learn programming in an easy, beginner-friendly way, inspired by my own early struggles with coding. This journey led me to create Teachyst — a platform that empowers educators to focus on teaching while we handle the tech. Today, Teachyst supports over 10,000 students, bridging the gap between teachers and learners for a smoother, more impactful experience.`,
    },
    // {
    //   id: "amitabh",
    //   name: "Amitabh Bacchan",
    //   profession: "Actor & Former MP",
    //   image: Amitabh,
    // },
  ],
  currentPersona: "",
};

export const personaSlice = createSlice({
  name: "persona",
  initialState,
  reducers: {
    setPersona: (state, action) => {
      let index = state.personas.findIndex(
        (persona) => persona.id === action.payload
      );
      state.currentPersona = state.personas[index];
    },
  },
});

export const { setPersona } = personaSlice.actions;
export default personaSlice.reducer;
