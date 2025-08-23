"use client";
import { useEffect, useState } from "react";
import ChatPanel from "@/components/chatPanel";
import ReferencePanel from "@/components/referencePanel";
import UserHoverCard from "@/components/userHoverCard";
import { UserModal } from "@/components/user-modal";
import { Sparkles, Brain } from "lucide-react";

export default function Home() {
  const [references, setReferences] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userUsername, setUserUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedUsername = localStorage.getItem("userUsername");

    if (storedName && storedUsername) {
      setUserName(storedName);
      setUserUsername(storedUsername);
      setShowUserModal(false);
    } else {
      setShowUserModal(true);
    }
  }, []);

  const handleUserSetup = (name, username) => {
    setUserName(name);
    setUserUsername(username);
    setShowUserModal(false);
  };

  const handleSendMessage = async (message, conversationHistory) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: message,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="lg:h-screen bg-primary/10 flex flex-col">
      <UserModal isOpen={showUserModal} onUserSetup={handleUserSetup} />
      <div className="">
        <header className="py-4 lg:px-6 md:px-6 px-4 text-center ">
          <div className="flex lg:justify-between md:justify-between justify-start items-center">
            <div className="flex items-center justify-start gap-3 ">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
                <Brain className="lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6  text-primary-foreground" />
              </div>
              <h1 className="lg:text-4xl md:text-4xl text-2xl font-serif font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI Reference Assistant
              </h1>
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            <div className="hidden md:inline-block lg:inline-block">
              <UserHoverCard name={userName} username={userUsername} />
            </div>
          </div>
          {userName && (
            <p className="block md:hidden lg:hidden text-sm text-primary/80 mt-4">
              Welcome back, {userName}! (@{userUsername})
            </p>
          )}
        </header>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pb-4 grow">
        <div className="glass-effect rounded-2xl p-1 gradient-border h-full">
          <ChatPanel
            hasReferences={references.length > 0}
            references={references}
            onSendMessage={handleSendMessage}
          />
        </div>

        <div className="glass-effect rounded-2xl p-1 gradient-border h-full">
          <ReferencePanel
            userUsername={userUsername}
            onReferencesChange={(newReferences) => setReferences(newReferences)}
          />
        </div>
      </div>
    </div>
  );
}
