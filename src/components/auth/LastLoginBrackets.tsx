import { motion, AnimatePresence } from "framer-motion";

interface LastLoginBracketsProps {
  isHighlighted: boolean;
  children: React.ReactNode;
  label: string;
}

const LastLoginBrackets = ({ isHighlighted, children, label }: LastLoginBracketsProps) => {
  return (
    <div className="relative">
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            className="absolute -inset-[6px] pointer-events-none z-10 rounded-2xl"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Gradient glow behind */}
            <div className="absolute inset-0 rounded-2xl bg-primary/8 blur-sm" />

            {/* Top-left */}
            <motion.span
              className="absolute top-0 left-0 w-7 h-7 pointer-events-none"
              initial={{ opacity: 0, x: 4, y: 4 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M2 20V8C2 4.68629 4.68629 2 8 2H20" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.span>

            {/* Top-right */}
            <motion.span
              className="absolute top-0 right-0 w-7 h-7 pointer-events-none"
              initial={{ opacity: 0, x: -4, y: 4 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M8 2H20C23.3137 2 26 4.68629 26 8V20" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.span>

            {/* Bottom-left */}
            <motion.span
              className="absolute bottom-0 left-0 w-7 h-7 pointer-events-none"
              initial={{ opacity: 0, x: 4, y: -4 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M2 8V20C2 23.3137 4.68629 26 8 26H20" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.span>

            {/* Bottom-right */}
            <motion.span
              className="absolute bottom-0 right-0 w-7 h-7 pointer-events-none"
              initial={{ opacity: 0, x: -4, y: -4 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M26 8V20C26 23.3137 23.3137 26 20 26H8" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export default LastLoginBrackets;
