'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ShareCard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })
  const [copied, setCopied] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const handleShare = async () => {
    const shareText = `🎉 Check out my v0 Vibecheck 2025! I sent 56 prompts, created 15 projects, and earned 5 achievements. Join me on my building journey! 🚀`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My v0 Vibecheck 2025',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(
        `${shareText}\n\n${window.location.href}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      {/* Main Card */}
      <motion.div
        className="relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Card Content */}
        <div className="relative bg-gradient-to-br from-card via-card to-card/80 border border-primary/50 rounded-3xl p-12 md:p-16 backdrop-blur-xl space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              Your v0 Vibecheck 2025
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground"
            >
              Share your building journey with the community
            </motion.p>
          </div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 bg-secondary/30 rounded-2xl p-6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">56</div>
              <div className="text-xs text-muted-foreground mt-1">Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">15</div>
              <div className="text-xs text-muted-foreground mt-1">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-xs text-muted-foreground mt-1">Achievements</div>
            </div>
          </motion.div>

          {/* Key Achievement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50 rounded-2xl p-6 text-center space-y-2"
          >
            <p className="text-sm text-primary font-semibold uppercase tracking-wider">
              Featured Achievement
            </p>
            <p className="text-2xl font-bold">🚀 Prompt Starter</p>
            <p className="text-sm text-muted-foreground">
              Every journey begins with a prompt. You're on your way.
            </p>
          </motion.div>

          {/* Share CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center pt-4"
          >
            <Button
              onClick={handleShare}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
            >
              {copied ? '✓ Copied to clipboard' : '🔗 Share Your Vibecheck'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl font-semibold border-primary/50 hover:bg-primary/10 bg-transparent"
              onClick={() => window.print()}
            >
              🖨️ Print Card
            </Button>
          </motion.div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="text-center text-xs text-muted-foreground pt-4"
          >
            Built with v0 • Celebrating creators who bring ideas to life
          </motion.p>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="space-y-4 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <p className="text-muted-foreground">
          What will you build in the next chapter? 🌟
        </p>
        <div className="flex justify-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-2xl">🚀</span>
          <span className="text-2xl">💫</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
