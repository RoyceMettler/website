// src/components/ParticlesBackground.tsx

import React, { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: "fixed",   // pin to the viewport
        top: 0,
        left: 0,
        width: "100vw",       // full viewport width
        height: "100vh",      // full viewport height
        zIndex: 0,
            }}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0
        },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: false,
          },
          modes: {
            repulse: {
              distance: 109, // The radius around the mouse that pushes particles
              duration: 0.4, // How long the repulsion effect lasts
              speed: 1, // How fast particles move away
              factor: 100, // Repulsion force factor
              easing: "ease-out-quad", // Easing function for smooth movement
              maxSpeed: 50, // Max speed particles can reach when being repulsed
            },
          },
        },
        particles: {
          color: {
            value: "#888888",
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.8,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 },
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 0.3,
            straight: false,
            // This makes the particles slide around the mouse pointer rather than just being pushed
            path: {
              enable: true,
              delay: {
                value: 0
              },
              options: {
                size: 20,
                draw: false,
                radius: 10
              }
            },
            trail: {
              enable: false
            }
          },
          links: {
            color: "#888888",
            distance: 90,
            enable: true,
            opacity: 0.2,
            width: 1,
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;