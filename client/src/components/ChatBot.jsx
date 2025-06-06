"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PiWaveformBold } from "react-icons/pi";
import { BsSun, BsMoon } from "react-icons/bs";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const chatContainerRef = useRef(null);

  // Load dark mode preference
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode) setDarkMode(JSON.parse(storedMode));
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiMessage },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex chatbot-container flex-col h-screen w-full mx-auto transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className={`py-4 px-6 shadow-sm flex items-center justify-between ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} flex items-center justify-center font-bold`}>
            AI
          </div>
          <div className="ml-3">
            <h2 className="font-semibold">Chat Assistant</h2>
            <p className="text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>{" "}Online
            </p>
          </div>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl p-2 text-gray-600 text-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <BsSun /> : <BsMoon />}
        </button>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto pb-32 p-4 space-y-6 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-gray-50'}`}
        style={{ minHeight: 'calc(100vh - 120px)' }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-sm md:max-w-lg lg:max-w-xl px-5 py-3 rounded-3xl text-sm shadow 
              ${message.role === 'user'
                  ? `rounded-tr-none ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-900'}`
                  : `rounded-tl-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-full text-sm shadow bg-gray-200 text-gray-500 rounded-tl-none animate-pulse">
              <p>Typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`border-t p-4 fixed bottom-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex justify-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className={`flex-1 px-8 py-1 rounded-full border w-full focus:outline-none focus:ring-0 
                ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-black'}`}
            />
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-black hover:opacity-90 text-white flex items-center justify-center"
            >
              <PiWaveformBold className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
