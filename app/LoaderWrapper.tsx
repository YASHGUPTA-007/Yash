'use client';
import React, { useEffect, useState } from "react";
import MatrixText from "@/components/kokonutui/matrix-text";

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setTimeout(() => setIsHydrated(true), 1500); // Add a small delay for smoother transition
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <MatrixText />
      </div>
    );
  }

  return <>{children}</>;
}
