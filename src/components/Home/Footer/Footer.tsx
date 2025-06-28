"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaClock,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          {/* Logo & Contact */}
          <div className="col-span-3">
            <Link href="/" className="block mb-6">
              <Image
                src="/logos/pamukkale-logo.png"
                alt="Pamukkale Logo"
                width={150}
                height={120}
              />
            </Link>
            <div className="space-y-2">
              <a
                href="tel:+494043024111"
                className="text-gray-600 hover:text-second flex items-center text-sm group"
              >
                <FaPhone className="mr-2 text-second/70 group-hover:text-second" />
                <span>+49 (40) 430 24 11</span>
              </a>
              <a
                href="mailto:info@pamukkalerestaurant.de"
                className="text-gray-600 hover:text-second flex items-center text-sm group"
              >
                <FaEnvelope className="mr-2 text-second/70 group-hover:text-second" />
                <span>info@pamukkalerestaurant.de</span>
              </a>
            </div>
          </div>

          {/* Address & Hours */}
          <div className="col-span-4 flex space-x-8">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Adresse
              </h4>
              <p className="text-sm text-gray-600">
                Pamukkale Restaurant Sternschanze
                <br />
                Susannenstr. 34-35
                <br />
                20357 Hamburg
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Öffnungszeiten
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Mo-Do: 09:00-01:00</p>
                <p>Fr-Sa: 09:00-03:00</p>
                <p>So: 09:00-01:00</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-3">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Quick Links
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { href: "/impressum", text: "Impressum" },
                { href: "/datenschutz", text: "Datenschutz" },
                { href: "/karriere", text: "Karriere" },
                { href: "/ueber-uns", text: "Über uns" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-second transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="col-span-2 flex items-start justify-end space-x-4">
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-second/5 transition-colors group"
            >
              <FaInstagram className="w-4 h-4 text-gray-600 group-hover:text-second" />
            </a>
            <a
              href="#"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-second/5 transition-colors group"
            >
              <FaFacebookF className="w-4 h-4 text-gray-600 group-hover:text-second" />
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="h-[200px] rounded-lg overflow-hidden mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2370.245370090135!2d9.9592651!3d53.5615294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18f5a463fffff%3A0x80fc9c4ba0f31c99!2sPamukkale%20Restaurant!5e0!3m2!1sen!2sde!4v1620000000000!5m2!1sen!2sde"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            aria-hidden="false"
            tabIndex={0}
          />
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Pamukkale Grill & Restaurant</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
