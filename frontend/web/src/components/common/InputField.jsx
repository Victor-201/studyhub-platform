import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function InputField({ icon: Icon, error, helperText, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: isFocused ? 1.01 : 1.05 }}
        animate={{
          scale: isFocused ? 1.04 : 1, 
          x: error ? [0, -3, 3, -3, 3, 0] : 0,
        }}
        transition={{
          scale: { type: "spring", stiffness: 200, damping: 20 },
          x: { duration: 0.02 },
        }}
        className="relative w-full"
      >
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon
              size={20}
              className={`transition-colors duration-300 ${
                error ? "text-[var(--color-error)]" : "text-[var(--color-brand-400)]"
              }`}
            />
          </span>
        )}

        <input
          className={`
            w-full
            ${Icon ? "pl-10" : "pl-4"}
            pr-4 py-2.5 rounded-lg
            border
            text-[var(--color-on-surface)]
            bg-[var(--color-surface)]
            ${error ? "border-[var(--color-error)]" : "border-[var(--color-brand-200)]"}
            focus:outline-none
            focus:ring-2 focus:ring-offset-1
            ${error ? "focus:ring-[var(--color-error)]" : "focus:ring-[var(--color-accent)]"}
            shadow-sm
            placeholder:text-[var(--color-brand-200)]
            transition-all duration-200
          `}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
      </motion.div>

      {/* Helper Text */}
      <AnimatePresence>
        {helperText && (
          <motion.p
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.1 }}
            className="mt-1 text-sm text-[var(--color-error)] select-none"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
