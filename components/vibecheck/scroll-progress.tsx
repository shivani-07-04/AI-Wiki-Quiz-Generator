'use client';

import { motion } from 'framer-motion'

interface ScrollProgressBarProps {
  scrollYProgress: any
}

export default function ScrollProgressBar({ scrollYProgress }: ScrollProgressBarProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary right-0 z-50 rounded-full origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
