"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, ChevronDown, X, Play, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { ContactModal } from '@/components/ui/contact-modal';
import Folder from '@/components/Folder';
import { Kbd } from '@/components/ui/kbd';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { CaseStudyJsonLd } from '@/components/seo/case-study-json-ld';

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  tech: string[];
  coverImage: string;
  images: string[];
  mission: string;
  vision: string;
  category: string;
  company: string;
  companyLogo: string;
  link: string;
}

interface CaseStudyContentProps {
  product: Product;
  nextProduct: Product | null;
  prevProduct: Product | null;
}

// Helper to determine media type
function getMediaType(url: string): 'image' | 'pdf' | 'video' | 'gif' {
  const lower = url.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) return 'video';
  if (lower.endsWith('.gif')) return 'gif';
  return 'image';
}

// Extract filename from URL
function getFileName(url: string): string {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ').replace(/_/g, ' ');
}


// Masonry item component (for images, videos, and GIFs only - not PDFs)
function MasonryItem({
  src,
  index,
  onClick
}: {
  src: string;
  index: number;
  onClick: () => void;
}) {
  const mediaType = getMediaType(src);
  const springConfig = { stiffness: 100, damping: 15, mass: 0.5 };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        ...springConfig,
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full cursor-pointer group rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-colors duration-300"
    >
      {mediaType === 'video' ? (
        <div className="relative w-full aspect-video bg-black">
          <video
            src={src}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-brand-primary/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-black ml-1" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <Image
            src={src}
            alt={`Project image ${index + 1}`}
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            quality={95}
          />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Index badge */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/80 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  );
}

// Lightbox component - renders via portal to escape stacking context
function Lightbox({
  src,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  currentIndex,
  total,
  allImages,
  onGoToIndex
}: {
  src: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentIndex: number;
  total: number;
  allImages: string[];
  onGoToIndex: (index: number) => void;
}) {
  const mediaType = getMediaType(src);
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const minZoom = 0.5;
  const maxZoom = 3;
  const zoomStep = 0.25;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag handlers for panning zoomed image
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || zoom <= 1) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mount check for SSR compatibility
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  // Scroll thumbnail strip to show active thumbnail
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleResetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  const lightboxContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      {/* Close button - top right */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-red-500/50 backdrop-blur-sm transition-colors"
        title="Close (Esc)"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Counter - top left */}
      <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium">
        {currentIndex + 1} / {total}
      </div>

      {/* Zoom controls - top center, only for images */}
      {mediaType === 'image' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
          <button
            onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
            disabled={zoom <= minZoom}
            className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom out (-)"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <span className="text-white/80 text-sm font-medium min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
            disabled={zoom >= maxZoom}
            className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom in (+)"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button
            onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            title="Reset zoom (0)"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Navigation - left */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Navigation - right */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Content */}
      <motion.div
        key={src}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="max-w-[90vw] max-h-[70vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {mediaType === 'pdf' ? (
          <iframe
            src={src}
            className="w-[90vw] h-[70vh] rounded-lg"
            title="PDF Document"
          />
        ) : mediaType === 'video' ? (
          <video
            src={src}
            className="max-w-full max-h-[70vh] rounded-lg"
            controls
            autoPlay
          />
        ) : (
          <div
            ref={imageContainerRef}
            className={`relative ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{
              touchAction: zoom > 1 ? 'none' : 'auto',
            }}
          >
            <Image
              src={src}
              alt="Full size image"
              width={1920}
              height={1080}
              className="max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain rounded-lg select-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              quality={100}
              draggable={false}
            />
          </div>
        )}
      </motion.div>

      {/* Thumbnail strip - bottom */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="relative">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none rounded-l-xl" />
          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none rounded-r-xl" />

          {/* Thumbnail container */}
          <div
            ref={thumbnailStripRef}
            className="flex items-center gap-2 py-2 px-8 overflow-x-auto bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {allImages.map((img, index) => {
              const imgMediaType = getMediaType(img);
              const isActive = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoToIndex(index);
                  }}
                  className={`relative flex-shrink-0 w-14 h-10 rounded-md overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-brand-primary ring-offset-1 ring-offset-black/50 scale-110'
                      : 'opacity-50 hover:opacity-80 hover:scale-105'
                  }`}
                >
                  {imgMediaType === 'pdf' ? (
                    <div className="w-full h-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-red-400">PDF</span>
                    </div>
                  ) : imgMediaType === 'video' ? (
                    <div className="w-full h-full bg-brand-primary/20 flex items-center justify-center">
                      <Play className="w-3 h-3 text-brand-primary" />
                    </div>
                  ) : (
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint - bottom */}
      <div className="hidden absolute bottom-6 left-1/2 -translate-x-1/2 md:flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <Kbd className="bg-white/20 text-white/80 border-none rounded">←</Kbd>
          <Kbd className="bg-white/20 text-white/80 border-none rounded">→</Kbd>
          <span className="text-white/50 text-xs ml-1">Navigate</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Kbd className="bg-white/20 text-white/80 border-none rounded">+</Kbd>
          <Kbd className="bg-white/20 text-white/80 border-none rounded">-</Kbd>
          <span className="text-white/50 text-xs ml-1">Zoom</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Kbd className="bg-white/20 text-white/80 border-none rounded">0</Kbd>
          <span className="text-white/50 text-xs ml-1">Reset</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Kbd className="bg-white/20 text-white/80 border-none rounded">Esc</Kbd>
          <span className="text-white/50 text-xs ml-1">Close</span>
        </div>
      </div>
    </motion.div>
  );

  // Use portal to render outside of any stacking context
  if (!mounted) return null;
  return createPortal(lightboxContent, document.body);
}

export default function CaseStudyContent({ product, nextProduct, prevProduct }: CaseStudyContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const smoothY = useSpring(heroY, { stiffness: 100, damping: 20 });
  const smoothOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 20 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <main className="min-h-screen bg-black">
      {/* JSON-LD Structured Data for SEO */}
      <CaseStudyJsonLd product={product} />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {/* Background Image */}
        <motion.div
          style={{ y: smoothY, scale: smoothScale }}
          className="absolute inset-0"
        >
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            className="object-cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: smoothOpacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-16 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Back link */}
              <motion.div variants={itemVariants}>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm">Back to Case Studies</span>
                </Link>
              </motion.div>

              {/* Category & Company */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                <span className="px-4 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-sm font-medium">
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white/10">
                    <Image
                      src={product.companyLogo}
                      alt={product.company}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="text-white/60 text-sm">{product.company}</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                {product.name}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-white/70 text-lg md:text-xl max-w-3xl leading-relaxed"
              >
                {product.description}
              </motion.p>

              {/* CTA */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <Link href={product.link} target="_blank">
                  <HoverBorderGradient>
                    <span className="flex items-center gap-2">
                      View Live Project <ExternalLink className="w-4 h-4" />
                    </span>
                  </HoverBorderGradient>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Story Section - The Challenge */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-brand-primary/5 to-black pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left - Story */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium inline-block">
                  The Story
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  <EncryptedText
                    text={product.longDescription || product.description}
                    revealDelayMs={8}
                    flipDelayMs={10}
                    encryptedClassName="text-white/30"
                    revealedClassName="text-white"
                  />
                </h2>
              </div>

              {/* Mission */}
              <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  Mission
                </h3>
                <p className="text-white/60 leading-relaxed">{product.mission}</p>
              </div>

              {/* Vision */}
              <div className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary" />
                  Vision
                </h3>
                <p className="text-white/60 leading-relaxed">{product.vision}</p>
              </div>
            </div>

            {/* Right - Features & Tech */}
            <div className="space-y-8">
              {/* Company Info */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={product.companyLogo}
                    alt={product.company}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{product.company}</h3>
                  <span className="text-brand-primary text-sm">{product.category}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tech.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Pinterest Style */}
      {(() => {
        // Separate PDFs from other media
        const pdfFiles = product.images.filter(img => getMediaType(img) === 'pdf');
        const nonPdfFiles = product.images.filter(img => getMediaType(img) !== 'pdf');

        return (
          <section className="py-24 relative">
            <div className="mx-auto max-w-full px-4">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium inline-block">
                  Visual Journey
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mt-6">
                  Project <span className="text-brand-primary">Gallery</span>
                </h2>
                <p className="text-white/50 mt-4 max-w-xl mx-auto">
                  Explore the design system, user interfaces, and key screens that bring this project to life
                </p>
              </motion.div>

              {/* Masonry Grid - Images and Videos only */}
              {nonPdfFiles.length > 0 && (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {nonPdfFiles.map((image, index) => {
                    const originalIndex = product.images.indexOf(image);
                    return (
                      <MasonryItem
                        key={index}
                        src={image}
                        index={index}
                        onClick={() => setLightboxIndex(originalIndex)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Documents Section - PDFs as Folder badges */}
              {pdfFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={nonPdfFiles.length > 0 ? "mt-20" : ""}
                >
                  <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Project <span className="text-brand-primary">Documents</span>
                    </h3>
                    <p className="text-white/50 mt-2 text-sm">
                      Click folders to view detailed documentation
                    </p>
                  </div>

                  {/* PDF Folders Grid */}
                  <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                    {pdfFiles.map((pdf, index) => {
                      const originalIndex = product.images.indexOf(pdf);
                      const filename = getFileName(pdf);

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <Folder
                            color="#3CB371"
                            size={1.3}
                            items={[
                              // Paper 1: PDF Badge
                              <div key="badge" className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg">
                                <span className="text-[10px] font-bold text-red-400 tracking-wide">PDF</span>
                              </div>,
                              // Paper 2: Document info
                              <div key="info" className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                                <div className="w-6 h-6 rounded bg-zinc-300 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-[7px] text-zinc-500 font-medium">Document</span>
                              </div>,
                              // Paper 3: View action (clickable)
                              <div
                                key="view"
                                className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-brand-primary/10 transition-colors rounded-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxIndex(originalIndex);
                                }}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-7 h-7 rounded-full bg-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/30 transition-colors">
                                    <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </div>
                                  <span className="text-[8px] font-semibold text-brand-primary">View</span>
                                </div>
                              </div>
                            ]}
                          />
                          <span className="text-white/70 text-sm font-medium capitalize max-w-[140px] truncate text-center mt-1">
                            {filename}
                          </span>
                          <span className="text-white/40 text-xs">Click to open</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        );
      })()}

      {/* Project Navigation */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Project */}
            {prevProduct ? (
              <Link href={`/case-studies/${prevProduct.slug}`} className="group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative h-48 rounded-2xl overflow-hidden border border-white/10 hover:border-brand-primary/30 transition-colors"
                >
                  <Image
                    src={prevProduct.coverImage}
                    alt={prevProduct.name}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Previous Project
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{prevProduct.name}</h3>
                    <span className="text-brand-primary text-sm mt-1">{prevProduct.category}</span>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next Project */}
            {nextProduct ? (
              <Link href={`/case-studies/${nextProduct.slug}`} className="group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative h-48 rounded-2xl overflow-hidden border border-white/10 hover:border-brand-primary/30 transition-colors"
                >
                  <Image
                    src={nextProduct.coverImage}
                    alt={nextProduct.name}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center items-end text-right">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                      Next Project
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{nextProduct.name}</h3>
                    <span className="text-brand-primary text-sm mt-1">{nextProduct.category}</span>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/10 to-transparent pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/20 via-black/60 to-black/40 backdrop-blur-sm p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Inspired by This Project?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              {"Let's create something extraordinary together. Share your vision and we'll bring it to life."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2">
                  Start Your Project <ArrowRight className="w-4 h-4" />
                </span>
              </HoverBorderGradient>

              <Link href="/case-studies">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            src={product.images[lightboxIndex]}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((prev) => (prev !== null && prev < product.images.length - 1 ? prev + 1 : prev))}
            onPrev={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
            hasNext={lightboxIndex < product.images.length - 1}
            hasPrev={lightboxIndex > 0}
            currentIndex={lightboxIndex}
            total={product.images.length}
            allImages={product.images}
            onGoToIndex={(index) => setLightboxIndex(index)}
          />
        )}
      </AnimatePresence>

      <ContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="website"
        origin={`Case Study - ${product.name}`}
      />
    </main>
  );
}
