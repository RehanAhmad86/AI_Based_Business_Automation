"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PiWaveformBold } from "react-icons/pi";
import { BsSun, BsMoon } from "react-icons/bs";
import { MdImage, MdClose, MdChat, MdMinimize } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { LuMinimize2 } from "react-icons/lu";

const FloatingChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load dark mode preference - Using memory storage instead of localStorage
  useEffect(() => {
    // Default dark mode to false since we can't use localStorage
    setDarkMode(false);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        setSelectedImage(base64);
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    let userMessage;

    if (selectedImage) {
      // Message with image - OpenAI format
      userMessage = {
        role: "user",
        content: [
          { type: "text", text: input.trim() || "What's in this image?" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${selectedImage}`
            }
          }
        ],
        displayText: input.trim() || "What's in this image?",
        image: imagePreview,
        hasImage: true
      };
    } else {
      // Text-only message
      userMessage = { role: "user", content: input };
    }

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
    const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content // This will be text string or OpenAI image format
          }))
        }),
      });

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.choices[0].message.content };

      setMessages((prev) => [...prev, aiMessage]);

      // Clear image after sending
      removeImage();

    } catch (error) {
      console.error("Chat Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const expandChat = () => {
    setIsMinimized(false);
  };

  // Floating chat button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-110 flex items-center justify-center animate-pulse relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-10 rounded-full animate-ping"></div>
          <img
            src="/chatbot.png"
            alt="AI Assistant"
            className="h-8 w-8 object-contain relative z-10"
          />
        </button>

        {/* Smooth sliding tooltip */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 pointer-events-none">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700/50 whitespace-nowrap">
            <span className="text-sm font-medium text-white bg-clip-text text-transparent">
              Chat with our AI Assistant
            </span>
            {/* Animated arrow */}
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 transition-all duration-300 group-hover:scale-110"></div>
          </div>
        </div>

        {/* Enhanced notification badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 animate-bounce shadow-lg">
          <span className="text-white text-xs font-bold">AI</span>
        </div>
      </div>
    );
   }

  // Minimized chat window
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`w-80 h-16 rounded-t-xl shadow-2xl border transition-all duration-500 ease-in-out transform ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`h-full px-4 flex items-center justify-between ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center transition-all duration-300 p-1 shadow-md">
                <img
                  src="/chatbot.png"
                  alt="AI Assistant"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-sm">Chat Assistant</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={expandChat}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <MdChat size={18} />
              </button>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full expanded chat window - Fixed positioning and sizing
  return (
    <div className="fixed bottom-6 right-6 z-50 max-h-[calc(100vh-3rem)]">
      <div className={`w-96 h-[min(600px,calc(100vh-4rem))] rounded-xl shadow-2xl border transition-all duration-500 ease-in-out transform ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} flex flex-col`}>
        {/* Header - Enhanced with gradient */}
        <div className={`py-4 px-4 rounded-t-xl shadow-sm flex items-center justify-between flex-shrink-0 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-r from-white to-blue-50 text-gray-800'}`}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center transition-all duration-300 p-1 shadow-md">
              <img
                src="/chatbot.png"
                alt="AI Assistant"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Chat Assistant</h3>
              <p className="text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse mr-1"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-lg p-2 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              {darkMode ? <BsSun size={16} /> : <BsMoon size={16} />}
            </button>
            <button
              onClick={minimizeChat}
              className="text-gray-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <LuMinimize2 size={16} />
            </button>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <MdClose size={16} />
            </button>
          </div>
        </div>

        {/* Chat Area - Enhanced with gradient background */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 min-h-0 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50'}`}
          style={{ scrollbarWidth: 'thin' }}
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center opacity-70">
                <MdChat className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm">Start a conversation with AI Assistant</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl
                ${message.role === 'user'
                    ? `rounded-tr-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white`
                    : `rounded-tl-sm ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900'}`}`}
              >
                {message.hasImage && message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image}
                      alt="User uploaded"
                      className="max-w-full h-auto rounded-lg transition-all duration-300 hover:scale-105"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                )}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>
                    {message.displayText || message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm shadow-sm rounded-tl-sm animate-pulse ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-300' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'}`}>
                <p>Analyzing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className={`border-t p-3 flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs text-blue-600 font-medium">Image selected:</span>
              <button
                onClick={removeImage}
                className="text-red-500 hover:text-red-700 transition-colors duration-200 hover:scale-110 transform"
              >
                <MdClose size={16} />
              </button>
            </div>
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-16 rounded-lg shadow-md"
              />
            </div>
          </div>
        )}

        {/* Input Area - Enhanced styling */}
        <div className={`border-t p-3 rounded-b-xl flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-white to-blue-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder={selectedImage ? "Ask about this image..." : "Type your message..."}
                className={`flex-1 px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 
                  ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-blue-200 text-black placeholder-blue-400 focus:border-blue-400'}`}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md
                  ${selectedImage
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'}`}
              >
                <MdImage className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() && !selectedImage}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 shadow-md"
            >
              <PiWaveformBold className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar styling */
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  );
};

export default FloatingChatBot;