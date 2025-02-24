"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { videos } from "./videos";

gsap.registerPlugin(useGSAP);

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function Slider() {
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);

  // make sure we are client condition
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { contextSafe } = useGSAP(
    (context, contextSafe) => {
      if (isClient && sliderRef.current) {
        initializeCards();
      }
    },
    { scope: sliderRef, dependencies: [isClient, sliderRef] }
  );

  const initializeCards = contextSafe(() => {
    gsap.to(".slider-card", {
      y: (i) => 0 + 20 * i + "%",
      z: (i) => 15 * i,
      duration: 1,
      ease: "power3.out",
      stagger: -0.1,
    });
  });

  const handleClick = contextSafe(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const slider = sliderRef.current;
    const cards = Array.from(slider.querySelectorAll(".slider-card"));
    const lastCard = cards.pop();

    gsap.to(lastCard, {
      y: "+=150%",
      duration: 0.75,
      ease: "power3.inOut",
      onStart: () => {
        setTimeout(() => {
          slider.prepend(lastCard);
          initializeCards();
          setTimeout(() => {
            setIsAnimating(false);
          }, 1000);
        }, 300);
      },
    });
  });

  return (
    <>
      <div
        onClick={handleClick}
        className="slider-container w-full h-screen overflow-hidden relative"
      >
        <div
          className="slider w-full h-screen absolute top-[5vh] perspective-[175px] perspective-origin-[50%_100%] overflow-hidden transform-3d"
          ref={sliderRef}
        >
          {videos.map((video) => (
            <div
              className="slider-card absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] translate-z-0 w-[65%] h-[500px] bg-black border-r border-solid border-[#303030] rounded-[7px] overflow-hidden flex flex-col after:absolute after:top-0 after:left-0 after:w-full after:h-full after:border after:border-solid after:border-[#303030] after:rounded-[8px] after:z-10"
              key={video.title}
            >
              <div className="card-info w-full px-2 py-1 flex items-center bg-black z-10">
                <div className="card-item flex-1 text-left">
                  <p className="text-sm text-gray-400">{video.date}</p>
                </div>
                <div className="card-item flex-1 text-center text-white">
                  <p className="text-base font-semibold">{video.title}</p>
                </div>
                <div className="card-item flex-1 text-right">
                  <p className="text-sm text-gray-400">{video.category}</p>
                </div>
              </div>
              <div className="video-player w-full h-full overflow-hidden">
                <ReactPlayer
                  url={`/${video.url}`}
                  controls={false}
                  loop={true}
                  playing
                  muted={true}
                  width="100%"
                  height="100%"
                  className="relative scale-[3] md:scale-150"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Slider;
