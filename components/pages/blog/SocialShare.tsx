"use client";

import React from 'react';
import { 
  FaXTwitter, 
  FaFacebookF, 
  FaLinkedinIn, 
  FaPinterestP, 
  FaRedditAlien,
  FaLink
} from "react-icons/fa6";
import { motion } from 'framer-motion';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <FaXTwitter />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-black hover:text-white'
    },
    {
      name: 'Facebook',
      icon: <FaFacebookF />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedinIn />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-blue-700 hover:text-white'
    },
    {
      name: 'Pinterest',
      icon: <FaPinterestP />,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      color: 'hover:bg-red-600 hover:text-white'
    },
    {
      name: 'Reddit',
      icon: <FaRedditAlien />,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-orange-600 hover:text-white'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white/70 transition-colors ${link.color}`}
          aria-label={`Share on ${link.name}`}
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </motion.a>
      ))}
      <motion.button
        onClick={copyToClipboard}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white/70 hover:bg-brand-primary hover:text-black transition-colors"
        aria-label="Copy link"
        title="Copy link to clipboard"
      >
        <FaLink />
      </motion.button>
    </div>
  );
};

export default SocialShare;