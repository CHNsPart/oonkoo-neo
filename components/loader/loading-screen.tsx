import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      opacity: 0,
      fill: "rgba(0, 0, 0, 0)"
    },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      fill: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)", i === 0 ? "#3CB371" : "#404040"],
      transition: {
        pathLength: { 
          type: "spring",
          duration: 1.5,
          bounce: 0,
          delay: i * 0.2 
        },
        opacity: { duration: 0.01 },
        fill: {
          duration: 0.5,
          delay: (i * 0.2) + 1.5 
        }
      }
    })
  };

  return (
    <AnimatePresence mode='wait'>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          <div className="relative w-[200px] h-[74px]">
            <motion.svg
              width="338" 
              height="125" 
              viewBox="-3 -3 344 131" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <motion.path
                d="M124.118 62.0588C124.118 96.333 96.333 124.118 62.0588 124.118C27.7847 124.118 0 96.333 0 62.0588C0 27.7847 27.7847 0 62.0588 0C96.333 0 124.118 27.7847 124.118 62.0588Z"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                stroke="#3CB371"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M337.6 91.847C337.6 109.67 323.152 124.118 305.329 124.118C287.507 124.118 273.059 109.67 273.059 91.847C273.059 74.0245 287.507 59.5764 305.329 59.5764C323.152 59.5764 337.6 74.0245 337.6 91.847Z"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                stroke="#404040"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M132.61 1.24121L203.553 124.118H61.6675L132.61 1.24121Z"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                stroke="#404040"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M206.035 111.706L170.564 50.2677L241.507 50.2677L206.035 111.706Z"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                stroke="#404040"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M243.989 62.6794L279.46 124.118L208.518 124.118L243.989 62.6794Z"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                custom={4}
                stroke="#404040"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;