// Centralized Framer Motion Animation Variants & Spring Configurations for Project 2

export const springBounce = {
  type: "spring",
  stiffness: 400,
  damping: 18,
  mass: 0.8
};

export const springSnappy = {
  type: "spring",
  stiffness: 450,
  damping: 22
};

export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: 16 },
  transition: { type: "spring", stiffness: 420, damping: 25 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};

export const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: springBounce
  }
};

export const cardHoverEffect = {
  whileHover: {
    x: -3,
    y: -3,
    transition: { type: "spring", stiffness: 450, damping: 18 }
  },
  whileTap: {
    scale: 0.96,
    transition: { duration: 0.08 }
  }
};

export const buttonTapEffect = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.96 }
};
