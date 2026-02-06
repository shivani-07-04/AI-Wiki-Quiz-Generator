'use client';

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import AnimatedCounter from './animated-counter'

const stats = [
  { label: 'Prompts Sent', value: 56, icon: '✨' },
  { label: 'Projects Created', value: 15, icon: '🛠️' },
  { label: 'Days Active', value: 8, icon: '📅' },
]

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-5xl mx-auto space-y-16"
    >
      {/* Section Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-center space-y-4"
      >
        <h2 className="text-5xl md:text-6xl font-bold">Your Stats</h2>
        <p className="text-lg text-muted-foreground">
          A snapshot of your building journey in 2025
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            {/* Card */}
            <div className="relative bg-gradient-to-br from-card/80 to-card/40 border border-border/50 rounded-2xl p-8 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 h-full">
              <div className="space-y-6">
                {/* Icon */}
                <div className="text-5xl">{stat.icon}</div>

                {/* Counter Value */}
                <div className="space-y-2">
                  <motion.div
                    className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  >
                    {isInView ? (
                      <AnimatedCounter value={stat.value} />
                    ) : (
                      '0'
                    )}
                  </motion.div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Insight Text */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-8 text-center"
      >
        <p className="text-lg text-foreground">
          In just <span className="font-bold text-primary">8 days</span> of active building, you've
          sent <span className="font-bold text-accent">56 prompts</span> and created
          <span className="font-bold text-primary"> 15 unique projects</span>. That's the spirit of
          a true builder! 🎯
        </p>
      </motion.div>
    </motion.div>
  )
}
