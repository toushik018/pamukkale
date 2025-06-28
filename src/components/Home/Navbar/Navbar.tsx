"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CartWidget from "./CartWidget";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const menuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement[]>([]);

  // Initialize the navItemsRef array properly
  const addToNavRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && navItemsRef.current) {
      navItemsRef.current[index] = el;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsScrolled(scrollPos > 20);

      if (isHomePage) {
        const sections = document.querySelectorAll("section[id]");
        let foundActive = false;

        sections.forEach((section, index) => {
          const sectionElement = section as HTMLElement;
          const sectionTop = sectionElement.offsetTop - 120;
          const sectionHeight = sectionElement.offsetHeight;

          if (
            scrollPos >= sectionTop &&
            scrollPos < sectionTop + sectionHeight
          ) {
            setActiveItem(index + 1);
            foundActive = true;
          }
        });

        if (!foundActive || scrollPos < 100) {
          setActiveItem(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen]);

  const menus = [
    { name: "Home", path: "/", type: "route" },
    { name: "Online Bestellen", path: "menu-section", type: "scroll" },
    { name: "Galerie", path: "gallery-section", type: "scroll" },
    { name: "Rezensionen", path: "references-section", type: "scroll" },
    { name: "Kontakt", path: "reservation-section", type: "scroll" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-second shadow-md transition-all duration-300"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
            {/* Logo */}
            <Link href="/" className="relative">
              <div className="relative overflow-hidden">
                <Image
                  src="/logos/pamukkale-logo.png"
                  alt="Pamukkale Catering"
                  width={isScrolled ? 90 : 110}
                  height={isScrolled ? 36 : 44}
                  className="object-contain transition-all duration-300"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <div className="flex items-center space-x-2">
                {menus.map((menu, index) => {
                  const isActive =
                    (menu.type === "route" && pathname === menu.path) ||
                    (menu.type === "scroll" && activeItem === index);

                  return (
                    <div
                      key={index}
                      ref={(el) => addToNavRefs(el, index)}
                      className="px-1"
                    >
                      {menu.type === "scroll" ? (
                        <ScrollLink
                          to={menu.path}
                          spy={true}
                          smooth={true}
                          offset={-100}
                          duration={500}
                          className={`relative px-5 py-2 text-sm font-medium rounded-full inline-flex items-center transition-all cursor-pointer ${
                            isActive
                              ? "text-second bg-first"
                              : "text-first hover:text-first/80 hover:bg-first/10"
                          }`}
                        >
                          {menu.name}
                        </ScrollLink>
                      ) : (
                        <Link
                          href={menu.path}
                          className={`relative px-5 py-2 text-sm font-medium rounded-full inline-flex items-center transition-all ${
                            isActive
                              ? "text-second bg-first"
                              : "text-first hover:text-first/80 hover:bg-first/10"
                          }`}
                        >
                          {menu.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              {/* <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="p-2 rounded-full bg-first/10 border border-first/20 hover:bg-first/20 transition-colors">
                  <CartWidget />
                </div>
              </motion.div> */}

              {/* Login Button */}
              {/* <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden md:block"
              >
                <Link
                  href="/login"
                  className="group relative overflow-hidden px-6 py-2 font-medium text-second bg-first hover:bg-first/90 rounded-full flex items-center gap-2 transition-colors"
                >
                  <span>Einloggen</span>
                  <motion.div initial={{ x: 0 }} whileHover={{ x: 2, y: -2 }}>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </motion.div> */}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden relative p-2 rounded-full bg-first/10 border border-first/20 hover:bg-first/20 text-first transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer div to prevent content from going under navbar */}
      <div className="h-16 md:h-20 transition-all duration-300" />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-second/80 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 bg-second z-50 shadow-xl"
            >
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-first/10">
                  <Image
                    src="/logos/pamukkale-logo.png"
                    alt="Pamukkale Catering"
                    width={90}
                    height={36}
                    className="object-contain"
                  />

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full border border-first/10 text-first hover:bg-first/5 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="space-y-2">
                    {menus.map((menu, index) => {
                      const isActive =
                        (menu.type === "route" && pathname === menu.path) ||
                        (menu.type === "scroll" && activeItem === index);

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {menu.type === "scroll" ? (
                            <ScrollLink
                              to={menu.path}
                              spy={true}
                              smooth={true}
                              offset={-100}
                              duration={500}
                              className="block w-full"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div
                                className={`flex items-center p-3 rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-first text-second"
                                    : "text-first hover:bg-first/5 hover:text-first"
                                }`}
                              >
                                <span className="text-sm opacity-70 mr-3">
                                  0{index + 1}
                                </span>
                                <span>{menu.name}</span>
                              </div>
                            </ScrollLink>
                          ) : (
                            <Link
                              href={menu.path}
                              className="block w-full"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div
                                className={`flex items-center p-3 rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-first text-second"
                                    : "text-first hover:bg-first/5 hover:text-first"
                                }`}
                              >
                                <span className="text-sm opacity-70 mr-3">
                                  0{index + 1}
                                </span>
                                <span>{menu.name}</span>
                              </div>
                            </Link>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-10">
                    <Link
                      href="/login"
                      className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-second bg-first rounded-lg font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Einloggen</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-first/10">
                  <div className="flex justify-between text-first/40 text-sm">
                    <span>&copy; {new Date().getFullYear()} Pamukkale</span>
                    <div className="flex gap-4">
                      <Link
                        href="/impressum"
                        className="hover:text-first transition-colors"
                      >
                        Impressum
                      </Link>
                      <Link
                        href="/datenschutz"
                        className="hover:text-first transition-colors"
                      >
                        Datenschutz
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
