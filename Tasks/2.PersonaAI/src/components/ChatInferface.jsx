import React, { useEffect, useState } from "react";

function ChatInterface({ currentPersona }) {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  async function sendMessage() {
    const newMessages = [...allMessages, { role: "user", content: `${message}` }];
    setAllMessages(newMessages);
    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentPersona.id,
        messages: newMessages,
      }),
    });

    const data = await res.json();

    setAllMessages((prev) => [
      ...prev,
      { role: "assistant", content: `${data.content}` },
    ]);
  }

  useEffect(() => {
    setAllMessages([]);
  }, [currentPersona]);

  return (
    <div className="w-full h-full">
      <div className="h-[480px] overflow-y-auto scrollbar-gradient content-end px-6 mt-3 mb-2 me-2">
        {allMessages?.map((message) => {
          if (message.role === "assistant") {
            return (
              <>
                <div className="text-start mb-3">
                  <div className="inline-block rounded-t-4xl rounded-br-4xl p-3 max-w-2/5  bg-gradient-to-r from-pink-500/80 to-red-500/80 text-white">
                    {message.content}
                  </div>
                </div>
              </>
            );
          } else if (message.role === "user"){
            return (
              <>
               <div className="text-end mb-3">
                  <div className="inline-block rounded-t-4xl rounded-bl-4xl p-3 max-w-2/5  bg-gradient-to-r from-pink-500/80 to-red-500/80 text-white">
                    {message.content}
                  </div>
                </div>
              </>
            )
          }
        })}
      </div>
      <div className="flex justify-center gap-3 px-6">
        <div className="inline-block rounded-full p-[2px] grow bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/50">
          <form onSubmit={(e)=> {e.preventDefault(); sendMessage()}}>
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
        <button
          onClick={() => sendMessage()}
          className="px-6 py-4 cursor-pointer rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/50 text-white orbitron-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;
