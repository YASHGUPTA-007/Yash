"use client";

import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import Link from 'next/link';

import { InteractiveHoverButton } from "./interactive-hover-button";
import Btn03 from "../kokonutui/btn-03";
export function TypewriterEffectSmoothDemo() {
  const words = [
    
    {
      text: "Full-Stack",
      className: "text-white"
    },
    {
      text: "Web Developer",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[10rem]  ">
      <TypewriterEffectSmooth words={words} className="text-white" />
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
      <InteractiveHoverButton href="https://drive.google.com/file/d/1ocF1lNJ-EVqaZSFLw--YV4QhbrzY9I9B/view?usp=sharing">
  Download CV
</InteractiveHoverButton>

        <Link href="#contact">
          <Btn03 className="w-40 h-10 rounded-xl bg-white text-black hover:bg-gray-400 border border-black  text-sm">
            Hire Me
          </Btn03>
        </Link>
      </div>
    </div>
  );
}
