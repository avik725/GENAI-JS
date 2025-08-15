import React, { useEffect, useState } from "react";

function ChatInterface({ currentPersona }) {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [model, setModel] = useState({});
  const modelsAvailable = [
    { model: "gpt-4.1-mini", display_name: "GPT 4.1 Mini" },
    { model: "gpt-4.1", display_name: "GPT 4.1" },
    { model: "gpt-3.5-turbo", display_name: "GPT 3.5 Turbo" },
    { model: "gemini-1.5", display_name: "Gemini 1.5" },
    { model: "gemini-2.0", display_name: "Gemini 2.0" },
    { model: "gemini-2.0-flash", display_name: "Gemini 2.0 Flash" },
  ];
  const [modelDropdown, setModelDropdown] = useState(false);

  async function sendMessage() {
    const newMessages = [
      ...allMessages,
      { role: "user", content: `${message}` },
    ];
    setAllMessages(newMessages);
    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentPersona.id,
        messages: newMessages,
        model: model.model,
      }),
    });

    const data = await res.json();

    setAllMessages((prev) => [
      ...prev,
      { role: "assistant", content: `${data.content}` },
    ]);
  }

  useEffect(() => {
    setModel({ model: "gpt-4.1-mini", display_name: "GPT 4.1 Mini" });
  }, []);

  // useEffect(() => {
  //   setAllMessages([]);
  // }, [currentPersona]);

  return (
    <div className="flex flex-col w-full h-full pb-4">
      <div className="lg:h-[480px] xl:h-[480px] md:h-[400px] h-[300px] overflow-y-auto scrollbar-gradient content-end px-6 mt-3 mb-2 me-2">
        {allMessages?.map((message) => {
          if (message.role === "assistant") {
            return (
              <>
                <div className="text-start mb-3">
                  <div className="inline-block rounded-t-4xl rounded-br-4xl p-3 lg:max-w-2/5 md:max-w-3/5 max-w-4/5 bg-gradient-to-r from-pink-500/80 to-red-500/80 text-white">
                    {message.content}
                  </div>
                </div>
              </>
            );
          } else if (message.role === "user") {
            return (
              <>
                <div className="text-end mb-3">
                  <div className="inline-block rounded-t-4xl rounded-bl-4xl p-3 lg:max-w-2/5 md:max-w-3/5 max-w-4/5 bg-gradient-to-r from-pink-500/80 to-red-500/80 text-white">
                    {message.content}
                  </div>
                </div>
              </>
            );
          }
        })}
      </div>

      <div className="grid grid-cols-12 gap-3 px-6">
        <div className="lg:col-span-7 col-span-12 inline-block rounded-full p-[2px] grow bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              className="rounded-full px-6 py-4 text-white w-full focus:outline-none border border-white/30 bg-white/20"
              id="message_input"
              name="message_input"
              value={message}
              placeholder="Type Here ..."
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>
        </div>
        <div className="col-span-12 lg:col-span-5 md:flex gap-3 relative m-0 p-0">
          {modelDropdown && (
            <div className="absolute p-2 lg:top-[-360px] md:top-[-340px] top-[-340px] rounded-4xl z-10 bg-gradient-to-r from-pink-500 to-red-500">
              {modelsAvailable?.map((model, index) => (
                <button
                  onClick={() => {
                    setModel(model);
                    setModelDropdown((prev) => !prev);
                  }}
                  className={`w-full capitalize cursor-pointer ${
                    index !== modelsAvailable.length - 1 && "mb-3"
                  } bg-white/10 border border-white/40 rounded-4xl text-white py-2`}
                >
                  {model.display_name} Model
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setModelDropdown((prev) => !prev)}
            className="capitalize px-4 w-full md:w-auto mb-3 md:mb-0 lg:mb-0 lg:w-auto py-4 cursor-pointer md:grow lg:grow rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/50 text-white orbitron-600"
          >
            {model.display_name}
            {<i className="fa-solid fa-chevron-up ms-2"></i>}
          </button>

          <button
            onClick={() => sendMessage()}
            className="px-6 py-4 md:w-1/3 w-full lg:w-auto cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/50 text-white orbitron-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
