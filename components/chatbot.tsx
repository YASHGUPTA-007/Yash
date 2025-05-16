"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const predefinedQuestions = [
  "Who am I?",
  "What are my projects?",
  "What are my strengths?",
  "Tell me something funny about me",
  "What tech stack do I use?",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPredefined, setShowPredefined] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const apiKey = "AIzaSyCb8O6CQYR2uiRF7CEWJ4mkgxASrvBzb1Y";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (userQuery: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userQuery,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowPredefined(false);

    const promptText = `You are YashGPT – a chatbot that mimics the personality of Yash Gupta, a witty and sarcastic developer. Your goal is to answer questions about Yash's life, skills, or projects in a SHORT and FUNNY way.

Tone:
- Keep it sarcastic, informal, and engaging — like Yash himself.
- Always answer in clear BULLET POINTS (no long paragraphs).
- Responses should be informative but brief — around 3–5 points max.
- End with a one-liner punchline or nerdy joke if it fits.

Yash's Info:
- B.Tech CSE @ ITM University, Gwalior | CGPA: 7.42
- Loves tech, coding, and sarcastic comebacks
- Projects:
   • Bhasha Hub – AI code editor, multi-language runner, code sharing, dashboard
   • Gwalior Darshan – Travel site with animations, Supabase auth, Gemini chatbot
   • College Lab Manager – MERN app for managing hardware
- Skills: JS, TS, React, Next.js, Tailwind, MongoDB, Convex, Zustand, Clerk.js, Gemini API

Now answer this like Yash would (in points, with swag):
"${userQuery}"`;

    try {
      const result = await model.generateContent([promptText]);
      const response = await result.response;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text(),
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "Oops! Something broke. Probably Yash forgot to close a div.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input.trim());
    }
  };

  return (
    <div className="pt-24">
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-lg">
            <h2 className="text-2xl font-serif mb-4 text-white">Ask YashGPT</h2>

            {/* Predefined Questions */}
            {showPredefined && (
              <div className="flex flex-wrap gap-2 mb-4">
                {predefinedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-4 py-1 text-sm rounded-full bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="h-80 overflow-y-auto border border-white/20 p-4 mb-4 rounded backdrop-blur-sm bg-white/5"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-300 mt-10">
                  <p className="text-lg">Welcome to YashGPT.</p>
                  <p className="text-sm mt-2 text-gray-400">
                    Click a question or type your own!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 max-w-[75%] px-4 py-2 rounded-2xl shadow-md ${
                      message.role === "user"
                        ? "ml-auto bg-blue-600 text-white"
                        : "mr-auto bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center border-t border-white/20 pt-2"
            >
              <input
                type="text"
                className="flex-1 p-2 bg-transparent border border-white/20 text-white placeholder-gray-400 rounded-l focus:outline-none"
                placeholder="Ask anything about Yash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-white/10 text-white px-4 py-2 rounded-r hover:bg-white/20 transition flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Send, Loader2 } from "lucide-react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import ReactMarkdown from "react-markdown";

// interface Message {
//   id: string;
//   content: string;
//   role: "user" | "assistant";
//   timestamp: Date;
// }

// export default function ChatBot() {
//   const initialBotMessage: Message = {
//     id: "init",
//     content: `Welcome to the Gwalior Heritage Explorer!

// Here are some topics you can explore about Gwalior:
// 1. **Gwalior Fort** - Discover the architectural marvel and its historical significance.
// 2. **Royal Palaces & Museums** - Learn about the royal legacy and cultural treasures.
// 3. **Local Temples & Religious Heritage** - Explore ancient temples and their stories.
// 4. **Festivals & Traditions** - Understand the vibrant cultural events of the city.

// Feel free to ask about any of these topics or any other aspect of Gwalior's history and heritage.`,
//     role: "assistant",
//     timestamp: new Date(),
//   };

//   const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const messagesContainerRef = useRef<HTMLDivElement>(null);

//   // Initialize API
//   const apiKey = "AIzaSyCb8O6CQYR2uiRF7CEWJ4mkgxASrvBzb1Y";
//   const genAI = new GoogleGenerativeAI(apiKey);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const scrollToBottom = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTop = container.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: input.trim(),
//       role: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     const userQuery = input.trim();
//     setInput("");
//     setIsLoading(true);

//     try {
//       const promptText = `You are an expert on the history and heritage of Gwalior city. Only share information about Gwalior. Now answer the following question: ${userQuery}`;

//       const result = await model.generateContent([promptText]);
//       const response = await result.response;

//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: response.text(),
//         role: "assistant",
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Error communicating with Gemini API:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 1).toString(),
//           content: "Failed to fetch response. Please try again later.",
//           role: "assistant",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="pt-24">
//       <section className="py-24">
//         {" "}
//         {/* Removed bg-stone-100 */}
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="p-6 rounded-lg">
//             {" "}
//             {/* Removed bg-white and shadow-lg */}
//             <h2 className="text-2xl font-serif mb-4 text-white">
//               Ask About Gwalior's Heritage
//             </h2>
//             <div
//               ref={messagesContainerRef}
//               className="h-80 overflow-y-auto border border-white/20 p-4 mb-4 rounded backdrop-blur-sm bg-white/5"
//             >
//               {messages.length === 0 ? (
//                 <div className="text-center text-gray-300 mt-10">
//                   <p className="text-lg">How can I assist you today?</p>
//                   <p className="text-sm mt-2 text-gray-400">Ask me anything!</p>
//                 </div>
//               ) : (
//                 messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`mb-2 p-2 rounded ${
//                       message.role === "user"
//                         ? "bg-blue-500/30 text-right"
//                         : "bg-gray-500/30 text-left"
//                     }`}
//                   >
//                     <div className="text-white">
//                       <ReactMarkdown>{message.content}</ReactMarkdown>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//             <form
//               onSubmit={handleSubmit}
//               className="flex items-center border-t border-white/20 pt-2"
//             >
//               <input
//                 type="text"
//                 className="flex-1 p-2 bg-transparent border border-white/20 text-white placeholder-gray-400 rounded-l focus:outline-none"
//                 placeholder="Ask about Gwalior..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 disabled={isLoading || !input.trim()}
//                 className="bg-white/10 text-white px-4 py-2 rounded-r hover:bg-white/20 transition flex items-center"
//               >
//                 {isLoading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <Send className="h-5 w-5" />
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
