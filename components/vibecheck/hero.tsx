'use client';

import { motion } from 'framer-motion'

interface HeroProps {
  opacity: any
}

export default function HeroSection({ opacity }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      style={{ opacity }}
      className="text-center space-y-8 max-w-4xl mx-auto"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Year Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/50 backdrop-blur-sm">
            <p className="text-sm font-semibold text-accent">v0 Vibecheck 2025</p>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
        >
          Your v0 Journey
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Every journey begins with a prompt. You're on your way.
        </motion.p>

        {/* Achievement Highlight */}
        <motion.div
          variants={itemVariants}
          className="pt-4"
        >
          <div className="inline-block px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 backdrop-blur-sm">
            <p className="text-sm md:text-base font-medium text-primary">
              🚀 Prompt Starter Achievement Unlocked
            </p>
          </div>
        </motion.div>

        {/* CTA Text */}
        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base text-muted-foreground pt-8"
        >
          Scroll to explore your 2025 v0 stats and achievements
        </motion.p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent rounded-full blur-3xl" />
      </motion.div>
    </motion.div>
  )
}
