'use client';

import { motion } from 'framer-motion'

export default function ScrollPrompt() {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground font-medium">Scroll to explore</p>
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-center justify-center">
          <motion.div
            className="w-1 h-2 bg-muted-foreground rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  )
}
