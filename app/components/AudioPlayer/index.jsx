"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import CD from "@/public/cd.png";

gsap.registerPlugin(MotionPathPlugin, useGSAP);

// Audio Player with Gsap animation
function AudioPlayer({ textsPrimary, textSecondary, coverImage }) {
  const container = useRef();

  useEffect(() => {
    document
      .getElementById("def-1")
      .setAttribute("d", document.getElementById("path-1").getAttribute("d"));
    document
      .getElementById("def-2")
      .setAttribute("d", document.getElementById("path-2").getAttribute("d"));
  }, []);

  useGSAP(
    (context, contextSafe) => {
      const animationText = contextSafe((selector, delay) => {
        gsap.to(selector, {
          attr: { startOffset: "100%" },
          ease: "linear",
          duration: 10,
          repeat: -1,
          delay: delay,
        });
      });
      animationText("#Text1", 0);
      animationText("#Text2", 4);
      gsap.to(".cd-cover", {
        rotate: 360,
        duration: 10,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="player-container w-full h-screen overflow-hidden relative"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 350"
        width="800px"
        height="600px"
        id="primary-text"
        className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] overflow-visible font-sans text-[46px]"
      >
        <defs>
          <path id="def-1" className="fill-transparent" />
        </defs>
        <path
          className="fill-transparent"
          id="path-1"
          d="M -393 405 C -53 405 -73 5 177 5 C 427 5 407 405 747 405"
        />
        <text className="uppercase fill-white">
          {textsPrimary.map((text, index) => (
            <textPath
              key={index}
              id={`Text${index + 1}`}
              xlinkHref="#def-1"
              startOffset="-90%"
              className="fill-white"
            >
              {text}
            </textPath>
          ))}
        </text>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 350"
        width="600px"
        height="600px"
        id="secondary-text"
        className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] overflow-visible font-sans text-[20px]"
      >
        <defs>
          <path id="def-2" className="fill-transparent" />
        </defs>
        <path
          className="fill-transparent"
          id="path-2"
          d="M -393 60 C -53 60 -70 365 180 365 C 421 352 407 60 725 56"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="end"
          textAnchor="middle"
          className="uppercase fill-white"
        >
          <textPath
            id="Text5"
            xlinkHref="#def-2"
            startOffset="37%"
            className="fill-white"
          >
            {textSecondary}
          </textPath>
        </text>
      </svg>
      <div className="cd-cover absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[550px] h-[550px] rounded-full">
        <Image src={CD} alt="CD Image" className="w-full h-full object-cover" />
        <div className="cover-img absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[250px] h-[250px] rounded-full overflow-hidden">
          <Image
            src={coverImage}
            alt="Album Cover"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
