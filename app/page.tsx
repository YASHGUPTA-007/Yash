"use client";
import Hero from "@/components/Hero";
import "../app/globals.css";
import Skills from "@/components/Tech_Stack";
import { FloatingDockDemo } from "@/components/magicui/Dock";
import Contact from "@/components/Contact";
import Projects from "@/components/Projects";
import { IconCloudDemo } from "@/components/magic_ui";

import BackgroundParticles from "@/components/BackgroundParticles";
import ChatBot from "@/components/chatbot";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Particles behind everything */}
      <div className="hidden sm:block">
      <BackgroundParticles  />
      </div>
      

      {/* Main content */}
      <main className="relative z-10  text-white flex flex-col">
        <Hero />
        <Projects />
        <ChatBot />
        <div className="hidden sm:block ">
          <IconCloudDemo />
        </div>
        
        <Skills />

        <div className="relative z-56">
          <FloatingDockDemo />
        </div>

        <Contact />
      </main>
    </div>
  );
}
