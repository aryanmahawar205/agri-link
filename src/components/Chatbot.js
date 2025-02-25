"use client";

import { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiX, FiMinus } from "react-icons/fi";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    const message = inputRef.current?.value.trim();
    if (!message) return;
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    inputRef.current.value = ""; // Clear input after sending

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "I'm having trouble responding right now. Try again later.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FiMessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[28rem] bg-white shadow-lg rounded-lg border border-gray-200 p-4 relative">
          {/* Chat Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Chatbot</h3>
            <div className="flex gap-2">
              {/* Minimize Button */}
              <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-500 hover:text-gray-700">
                <FiMinus size={20} />
              </button>
              {/* Close Button */}
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto border-b border-gray-300 mb-2 p-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`my-1 p-2 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-green-100 text-black self-end ml-auto"
                        : "bg-gray-200 text-black self-start"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 border p-3 rounded-l-lg text-black bg-white placeholder-gray-500 focus:outline-none"
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-green-500 text-white px-4 py-3 rounded-r-lg hover:bg-green-600 transition"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
