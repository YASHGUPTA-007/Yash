// components/BackgroundParticles.tsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";
import type { Engine } from "tsparticles-engine";


const BackgroundParticles = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadLinksPreset(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: "links",
        fullScreen: false,
        background: {
          color: "transparent",
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
};

export default BackgroundParticles;
