import { motion, AnimatePresence } from "framer-motion";

interface LastLoginBracketsProps {
  isHighlighted: boolean;
  children: React.ReactNode;
  label: string;
}

const LastLoginBrackets = ({ isHighlighted, children, label }: LastLoginBracketsProps) => {
  return (
    <div className={isHighlighted ? "py-2" : ""}>
      <div className="relative">
        <AnimatePresence>
          {isHighlighted && (
            <motion.div
              className="absolute -inset-2 pointer-events-none z-10 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                border: "2px solid hsl(var(--primary))",
              }}
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
};

export default LastLoginBrackets;
