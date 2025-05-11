import { IconCloud } from "./magicui/icon-cloud";
import { IconCloudMobile } from "./magicui/icon-cloud-mobile";
const imageUrls = [
    "/cpp.png",
    "/css-3.png",
    "/html-1.png",
    "/java.png",
    "/javascript.png",
    "/mongodb-icon-1.png",
    "/nextjs-2.png",
    "/nodejs-2.png",
    "/postgresql.png",
    "/react-2.png",
    "/tailwind-css-2.png",
    "/ts.png",
    "/typescript.png",
    "/vercel.png",
  ];
  
  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "C++",
    "Rust",
    "C#",
    "Ruby",
    "Swift",
    "HTML",
    "CSS",
    "SQL"
  ];
  
export function IconCloudDemo() {

  return (
    <div className="flex flex-col items-center justify-center my-5 px-4">
    {/* Mobile View */}
    {/* Mobile View */}
    <div className="w-full flex items-center justify-center md:hidden">
      <IconCloudMobile images={imageUrls} />
    </div>

    {/* Laptop/Desktop View */}
    <div className="w-full items-center justify-center hidden md:flex">
      <IconCloud images={imageUrls} />
    </div>
  </div>

  );
}
