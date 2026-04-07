import { cn } from "@/lib/utils";

interface LastLoginBracketsProps {
  isHighlighted: boolean;
  children: React.ReactNode;
  label: string;
}

const LastLoginBrackets = ({ isHighlighted, children, label }: LastLoginBracketsProps) => {
  return (
    <div className="relative">
      {isHighlighted && (
        <>
          {/* Top-left corner */}
          <span className="absolute -top-2 -left-2 w-5 h-5 border-t-[2.5px] border-l-[2.5px] border-primary rounded-tl-lg pointer-events-none z-10" />
          {/* Top-right corner */}
          <span className="absolute -top-2 -right-2 w-5 h-5 border-t-[2.5px] border-r-[2.5px] border-primary rounded-tr-lg pointer-events-none z-10" />
          {/* Bottom-left corner */}
          <span className="absolute -bottom-2 -left-2 w-5 h-5 border-b-[2.5px] border-l-[2.5px] border-primary rounded-bl-lg pointer-events-none z-10" />
          {/* Bottom-right corner */}
          <span className="absolute -bottom-2 -right-2 w-5 h-5 border-b-[2.5px] border-r-[2.5px] border-primary rounded-br-lg pointer-events-none z-10" />
        </>
      )}
      {children}
    </div>
  );
};

export default LastLoginBrackets;
