"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import Slider from "./components/Slider";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const cardWords = [
  ["老师",
    "世界和平"],
  ["乐天知命",
    "居安思危"],
  ["知识本无罪",
  "庸师自扰之"],
]

function HomePage() {
  const container = useRef();
  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div
          className="card-row relative w-full my-1 md:my-3 flex justify-center gap-2 md:gap-5"
          key={i}
        >
          <div className="card-left relative w-1/2 h-[240px] md:w-[40%] md:h-[360px] rounded md:rounded-xl overflow-hidden will-change-transform bg-[#fffce1] text-black border p-4 border-black text-6xl flex items-center justify-center font-sans after:w-5 after:h-5 after:absolute after:left-2 after:top-2 after:rounded-full after:bg-black antialiased">
            <p>{cardWords[i-1][0]}</p>
          </div>
          <div className="card-right relative w-1/2 h-[240px] md:w-[40%] md:h-[360px] rounded md:rounded-xl overflow-hidden will-change-transform bg-[#fffce1] text-black border p-4 border-black text-6xl flex items-center justify-center font-sans after:w-5 after:h-5 after:absolute after:right-2 after:top-2 after:rounded-full after:bg-black antialiased">
            <p>{cardWords[i-1][1]}</p>
          </div>
        </div>
      );
    }
    return rows;
  };

  useGSAP(
    () => {
      const scrollTriggerSettings = {
        trigger: ".main-container",
        start: "60% center",
        // markers: true,
        toggleActions: "play pause resume reverse",
      };
      const leftXValues = [-200, -230, -210];
      const rightXValues = [200, 230, 210];
      const leftRotationValues = [-15, -18, -17];
      const rightRotationValues = [15, 18, 17];
      const yValues = [100, -150, -400];
      gsap.utils.toArray(".card-row").forEach((row, index) => {
        const cardLeft = row.querySelector(".card-left");
        const cardRight = row.querySelector(".card-right");
        gsap.to(cardLeft, {
          x: leftXValues[index],
          scrollTrigger: {
            trigger: ".main-container",
            start: "center center",
            // markers: true,
            end: "100% bottom",
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              cardLeft.style.transform = `translateX(${progress * leftXValues[index]}px) translateY(${progress * yValues[index]}px) rotate(${progress * leftRotationValues[index]}deg)`;
            },
          },
        });
        gsap.to(cardRight, {
          x: rightXValues[index],
          scrollTrigger: {
            trigger: ".main-container",
            start: "center center",
            end: "100% bottom",
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              cardRight.style.transform = `translateX(${progress * rightXValues[index]}px) translateY(${progress * yValues[index]}px) rotate(${progress * rightRotationValues[index]}deg)`;
            },
          },
        });
      });

      gsap.to(".author-logo", {
        scale: 1,
        duration: 1.5,
        ease: "power1.out",
        scrollTrigger: scrollTriggerSettings,
      });
      gsap.to(".line p", {
        y: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "power1.out",
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.to(".website-footer", {
        scrollTrigger: {
          trigger: ".website-footer",
          toggleActions: "restart none none none",
        },
        duration: 1.8,
        opacity: 1,
        ease: "power3.out",
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <>
      <ReactLenis root>
        <main className="w-full h-full font-sans bg-black text-white">
          <Slider />
          <section
            className="main-container relative w-full h-full flex flex-col justify-center items-center overflow-hidden pt-10"
            ref={container}
          >
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col items-center">
              <div className="author-logo relative size-24 rounded-full overflow-hidden scale-0">
                <Image
                  src="/yinlei.jpg"
                  alt="author"
                  className="w-full h-full object-cover"
                  fill
                />
              </div>
              <div className="my-5 flex flex-col justify-center items-center">
                <div className="line relative my-2 w-max h-[30px] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
                  <p className="relative text-[24px] translate-y-[30px]">
                    蒙娜丽莎的微笑
                  </p>
                </div>
              </div>
            </div>
            {generateRows()}
            <div className="website-footer opacity-0 w-full absolute bottom-0 left-0 p-4 flex items-center justify-between text-xs">
              <span>©2025 Pixel Perfect.All rights reserved.</span>
              <span>Privacy Policy.Terms of Use.</span>
            </div>
          </section>
        </main>
      </ReactLenis>
    </>
  );
}

export default HomePage;
