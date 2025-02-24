"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Auth from "../Auth";
import { usePathname } from "next/navigation";
import clsx from "clsx";

gsap.registerPlugin(useGSAP);

const menus = [
  { path: "/", label: "Home" },
  { path: "/files", label: "Software" },
  { path: "/about", label: "About" },
];

// Menu with Gsap animation
function Menu() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const container = useRef();
  const tl = useRef();

  useGSAP(
    () => {
      gsap.set(".menu-link-item-holder", { y: 75 });
      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })
        .to(".menu-link-item-holder", {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.inOut",
          delay: -0.75,
        });
    },
    { scope: container }
  );

  useEffect(() => {
    if (isMenuOpen) {
      tl.current.play();
    } else {
      tl.current.reverse();
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      ref={container}
      className={clsx("menu-container w-full h-[60px]", {
        "bg-black text-white": pathname.includes("about") || pathname === "/",
      })}
    >
      <div className="menu-bar fixed top-0 left-0 w-screen p-4 flex justify-between items-start z-40">
        <div className="menu-logo font-medium">
          <Link href="/">Pixel Perfect</Link>
        </div>
        <div className="flex space-x-4 items-center">
          <Auth />
          <div className="menu-open cursor-pointer" onClick={toggleMenu}>
            <p className="uppercase">Menu</p>
          </div>
        </div>
      </div>
      <div className="menu-overlay fixed top-0 left-0 w-screen h-screen p-4 flex bg-red-500 text-black z-40 [clip-path:polygon(0_0,100%_0,100%_0%,0%_0%)]">
        <div className="menu-overlay-bar hidden md:block">
          <div className="menu-logo">
            <Link href="/">Pixel Perfect</Link>
          </div>
        </div>
        <div className="menu-close-icon flex-[2] hidden md:flex items-end cursor-pointer">
          <XMarkIcon className="size-10" onClick={toggleMenu} />
        </div>
        <div className="menu-copy flex-[4] flex flex-col justify-between pt-8 md:pt-4">
          <div className="menu-links">
            {menus.map((link) => (
              <div
                className="menu-link-item w-max [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"
                key={link.path}
              >
                <div
                  className="menu-link-item-holder relative"
                  onClick={toggleMenu}
                >
                  <Link
                    href={link.path}
                    className="menu-link text-black text-[60px] md:text-[80px] font-medium tracking-wider"
                  >
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="menu-info flex">
            <div className="menu-info-col flex-1 flex flex-col justify-end">
              <a href="https://x.com/leiyin06388456">X &#8599;</a>
              <a href="https://www.youtube.com/@leiyin1998">Youtube &#8599;</a>
              <a href="https://space.bilibili.com/355529756?spm_id_from=333.788.0.0">
                Bilibili &#8599;
              </a>
              <a href="https://github.com/yinleiCoder">Github &#8599;</a>
            </div>
            <div className="menu-info-col flex-1 flex flex-col justify-end">
              <p>yl1099129793@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="menu-preview flex-[4] flex justify-end items-end">
          <p>Yin Lei</p>
        </div>
      </div>
    </div>
  );
}

export default Menu;
