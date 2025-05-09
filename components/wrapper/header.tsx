"use client";

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About Us', href: '/about-us' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  
  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']
  );

  const menuVars = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.5,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVars = {
    initial: {
      transition: {
        staggerChildren: 0.09,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  const mobileLinkVars = {
    initial: {
      y: "30vh",
      transition: {
        duration: 0.5,
        ease: [0.37, 0, 0.63, 1],
      },
    },
    open: {
      y: 0,
      transition: {
        ease: [0, 0.55, 0.45, 1],
        duration: 0.7,
      },
    },
  };

  return (
    <motion.header
      style={{ background: headerBackground }}
      className="fixed w-full top-0 z-[100]"
    >
      <div className="max-w-[1400px] mx-auto">
        <nav className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/oonkoo_logo.svg"
                alt="Oonkoo Logo"
                width={70}
                height={70}
                priority
                className='mix-blend-lighten'
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center gap-1 bg-black/5 backdrop-blur-md border border-black/10 px-2.5 py-2 rounded-full">
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium text-white/90 px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-200",
                    pathname === item.href ? 
                      "bg-white/10 backdrop-blur-md" : 
                      "hover:bg-white/5"
                  )}
                >
                  {pathname === item.href && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                    />
                  )}
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
            href="/client-portal"
            >
              <HoverBorderGradient>
                {"Let's Talk"}
              </HoverBorderGradient>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[110] p-2 text-white active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <motion.div
          initial="initial"
          animate={isOpen ? "animate" : "exit"}
          variants={menuVars}
          className="fixed left-0 top-0 w-full h-[100dvh] bg-black origin-top px-4 md:hidden overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(60, 179, 113, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)'
          }}
        >
          {/* Decorative Background Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-0 bottom-0 w-[80%] h-auto aspect-square pointer-events-none"
          >
            <Image
              src="/oonkoo_logo.svg"
              alt="Background Logo"
              fill
              className="object-contain rotate-[-12deg]"
            />
          </motion.div>
          <motion.div 
            className="flex flex-col h-full justify-center relative"
            variants={containerVars}
            initial="initial"
            animate={isOpen ? "open" : "initial"}
          >
            <div className="overflow-hidden">
              <motion.div 
                variants={mobileLinkVars}
                className="text-white/50 uppercase tracking-widest text-sm mb-8 pl-2"
              >
                Navigation
              </motion.div>
            </div>
            {navigation.map((item) => (
              <div key={item.name} className="overflow-hidden">
                <motion.div variants={mobileLinkVars}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between text-4xl sm:text-5xl font-bold py-4",
                      pathname === item.href ? 
                        "text-brand-primary" : 
                        "text-white/90 active:text-brand-primary"
                    )}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className={cn(
                      pathname === item.href ? 
                        "text-brand-primary" : 
                        "text-brand-primary/70"
                    )} />
                  </Link>
                </motion.div>
              </div>
            ))}
            <div className="overflow-hidden mt-8">
              <motion.div variants={mobileLinkVars}>
                <Link
                href="/client-portal"
                onClick={() => {
                  setIsOpen(false);
                }}
                >
                  <HoverBorderGradient className="w-full justify-center text-lg">
                    {"Let's Talk"}
                  </HoverBorderGradient>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}