'use client';

import { motion } from 'framer-motion';
import { ReviewCard } from './cards/ReviewCard';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const reviews = [
  {
    id: 1,
    name: "Sarah West",
    position: "Freelancer",
    image: "https://www.ai-portraits.org/_next/static/media/2.cad8e1fd.jpeg",
    review: "As a creative professional, I appreciate design that is functional, impactful, and perfectly aligned with brand goals.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rafi Hasan",
    position: "Co-Founder, Glo",
    image: "https://media.licdn.com/dms/image/v2/D4E03AQHl0ta_NaNGqg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1673347502102?e=1753920000&v=beta&t=6nQy87E6KeCyD0Hrd78hcVa3xtLIfuBxF0evV7bET-M",
    review: "A top-tier software agency delivering innovative, scalable solutions with exceptional quality and reliability.",
    rating: 5,
  },
  {
    id: 3,
    name: "Fahim Anis Khan",
    position: "Brand Officer, Pepsi",
    image: "/testimonials/deepon.jpg",
    review: "As a fellow creative professional, I have high standards when it comes to design.",
    rating: 5,
    featured: true,
  },
  {
    id: 4,
    name: "Asif Shariar",
    position: "CEO, Kolom.ai",
    image: "/testimonials/likhon.jpg",
    review: "Exceptional service and attention to detail. They truly understand modern design.",
    rating: 5,
  },
  {
    id: 5,
    name: "Tyler Steeves",
    position: "CEO, Omni Attention",
    image: "/testimonials/tyler.jpg",
    review: "In our fast-paced world of tech, it's crucial to have a creative partner who can keep up.",
    rating: 5,
  },
];

export default function Reviews() {
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 768) {
        setScreenSize('tablet');
      } else if (width < 1024) {
        setScreenSize('laptop');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCardPosition = (index: number) => {
    const positions = {
      mobile: [
        { left: '5%', top: '0px' },
        { left: '10%', top: '20px' },
        { left: '5%', top: '70px' },
        { left: '15%', top: '130px' },
        { left: '10%', top: '180px' },
      ],
      tablet: [
        { left: '10%', top: '0px' },
        { left: '45%', top: '30px' },
        { left: '10%', top: '120px' },
        { left: '45%', top: '150px' },
        { left: '25%', top: '250px' },
      ],
      laptop: [
        { left: '15%', top: '0px' },
        { left: '30%', top: '50px' },
        { left: '15%', top: '150px' },
        { left: '50%', top: '20px' },
        { left: '45%', top: '200px' },
      ],
      desktop: [
        { left: '27%', top: '0px' },
        { left: '37%', top: '50px' },
        { left: '30%', top: '150px' },
        { left: '50%', top: '20px' },
        { left: '45%', top: '200px' },
      ],
    };

    return positions[screenSize as keyof typeof positions][index % positions[screenSize as keyof typeof positions].length];
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 w-full relative z-[1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="flex flex-wrap justify-center gap-2 mb-6 text-brand-primary">
            {['Clients', 'Social Proof', 'Reviews'].map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium bg-brand-primaryLight/5 border border-white/10 text-xs sm:text-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
          >
            What Our Happy Client
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2"
          >
            <span>Review About</span>
            <div className="flex items-center gap-2">
              <span className='px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-sm'>
                <Image
                  src={"/oonkoo_logo.svg"}
                  alt="oonkoo logo"
                  width={100}
                  height={100}
                  className="w-20 sm:w-24 lg:w-[100px]"
                />  
              </span>
              <span>OonkoO</span>
            </div>
          </motion.div>
        </div>

        {/* Updated Reviews Layout */}
        <div className="max-w-[1200px] mx-auto">
          <div 
            className={`relative ${
              screenSize === 'mobile' 
                ? 'h-[500px] w-full' 
                : screenSize === 'tablet' 
                ? 'h-[800px]' 
                : 'h-[600px]'
            } mx-auto mt-20`}
          >
            {reviews.map((review, index) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                index={index}
                style={getCardPosition(index)}
              />
            ))}
            
            {/* "and many more" text */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-0 flex justify-center items-center w-full text-white/60 italic text-sm"
            >
              and many more...
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}