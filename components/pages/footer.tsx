"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaSquareXTwitter, FaSquareInstagram, FaLinkedin } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Footer() {

  const footerLinks = {
    'Quick Links': [
      { name: 'About', href: '/about-us' },
      { name: 'Case Studies', href: '/products' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Blogs', href: '/blogs' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
    'join us': [
      { name: 'Careers', href: '/careers' },
      { name: 'Culture', href: '/culture' },
    ],
    OonkoO: [
      { name: '🟢 Are you with us?', href: '/client-portal' },
    ],
  };

  const connect = [
    { icon: <FaSquareXTwitter />, href: 'https://x.com/OonkoOHQ' },
    { icon: <FaSquareInstagram />, href: 'https://www.instagram.com/oonkoohq/' },
    { icon: <FaLinkedin />, href: 'https://www.linkedin.com/company/oonkoo/' },
    { icon: <FaFacebookSquare />, href: 'https://www.facebook.com/OonkoOHQ/' },
    { icon: <SiGmail />, href: 'mailtp:oonkoo.mail@gmail.com' }
  ]

  return (
    <footer className="relative">
      {/* Main Footer Content */}
      <div className="relative bg-black/40 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 col-span-1 md:col-span-2"
            >
              <Link href="/" className="block">
                <Image
                  src="/oonkoo_logo.svg"
                  alt="OonkoO Logo"
                  width={200}
                  height={70}
                  className="size-28 w-auto hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <p className="text-white/70 max-w-md">
                {"There is no limit to what you can achieve with OonkoO. Let's create something extraordinary together."}
              </p>
              <div className="flex items-center gap-4">
                {connect.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.href}
                    className="text-white/70 hover:text-brand-primary transition-all duration-300 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8 col-span-1 md:col-span-3">
              {Object.entries(footerLinks).map(([category, links], index) => (
                <motion.div
                  key={category}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold capitalize relative">
                    {category}
                    <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-primary/50 rounded-full"></span>
                  </h3>
                  <ul className="space-y-3 pt-2">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-brand-primary transition-colors duration-200 text-sm sm:text-base"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
              <div className="flex items-center gap-2 shrink-0 md:mr-8">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-white/70 whitespace-nowrap">All systems operational</span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 text-sm text-white/70 w-full">
                <span>© 2024 OonkoO. All rights reserved</span>
                <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-brand-primary transition-colors">
                  Terms of Use
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px]" />
        </div>
      </div>
    </footer>
  );
}