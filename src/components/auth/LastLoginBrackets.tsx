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
              className="absolute -inset-2 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Left bracket: top-left corner + bottom-left corner */}
              <div
                className="absolute top-0 left-0 w-5 h-full"
                style={{
                  borderLeft: "2px solid hsl(var(--primary))",
                  borderTop: "2px solid hsl(var(--primary))",
                  borderBottom: "2px solid hsl(var(--primary))",
                  borderRadius: "12px 0 0 12px",
                }}
              />
              {/* Right bracket: top-right corner + bottom-right corner */}
              <div
                className="absolute top-0 right-0 w-5 h-full"
                style={{
                  borderRight: "2px solid hsl(var(--primary))",
                  borderTop: "2px solid hsl(var(--primary))",
                  borderBottom: "2px solid hsl(var(--primary))",
                  borderRadius: "0 12px 12px 0",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
};

export default LastLoginBrackets;
