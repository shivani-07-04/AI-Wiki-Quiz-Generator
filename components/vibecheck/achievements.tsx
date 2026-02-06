'use client';

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const achievements = [
  {
    title: 'Prompt Starter',
    description: 'Every journey begins with a prompt. You\'re on your way.',
    icon: '🚀',
    color: 'from-primary',
    isHighlighted: true,
  },
  {
    title: 'Tinkerer',
    description: 'You love exploring and tweaking designs. A creative mind!',
    icon: '🔧',
    color: 'from-blue-500',
  },
  {
    title: '9-to-5er',
    description: 'Building with purpose during the work day.',
    icon: '💼',
    color: 'from-cyan-500',
  },
  {
    title: 'Weekend Warrior',
    description: 'You bring your passion projects to life on weekends.',
    icon: '⚔️',
    color: 'from-orange-500',
  },
  {
    title: 'Rising Star',
    description: 'Your potential is limitless. Keep building amazing things!',
    icon: '⭐',
    color: 'from-yellow-500',
  },
]

export default function AchievementsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      ref={ref}
      className="w-full max-w-6xl mx-auto space-y-16"
    >
      {/* Section Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-center space-y-4"
      >
        <h2 className="text-5xl md:text-6xl font-bold">Your Achievements</h2>
        <p className="text-lg text-muted-foreground">
          Milestones that define your v0 journey
        </p>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`group relative ${achievement.isHighlighted ? 'lg:col-span-3 md:col-span-2' : ''}`}
          >
            {/* Gradient Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${achievement.color} to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-20`}
            />

            {/* Card */}
            <div
              className={`relative bg-gradient-to-br from-card/80 to-card/40 border transition-all duration-300 rounded-2xl p-8 backdrop-blur-sm hover:border-primary/50 group-hover:-translate-y-2 ${
                achievement.isHighlighted
                  ? 'border-primary/50 bg-gradient-to-br from-primary/20 via-card/50 to-accent/10'
                  : 'border-border/50'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {achievement.title}
                    </h3>
                    {achievement.isHighlighted && (
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/30 border border-primary/50 mb-3">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Featured Achievement
                        </p>
                      </div>
                    )}
                  </div>
                  <motion.div
                    className="text-5xl md:text-6xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {achievement.icon}
                  </motion.div>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ width: '0%' }}
                  animate={isInView ? { width: '100%' } : { width: '0%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Motivational Text */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="text-center space-y-4 pt-8"
      >
        <p className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed">
          You've unlocked <span className="font-bold text-primary">5 achievements</span> in 2025.
          Each one represents a milestone in your creative journey. Keep pushing boundaries! 💪
        </p>
      </motion.div>
    </motion.div>
  )
}
