// src/components/auth/AuthLayout.jsx
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/assets/images/logo.png";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function AuthLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-6
        bg-[var(--color-brand-50)]
        dark:bg-[var(--color-brand-700)]
      "
    >
      <div
        className="
          w-full max-w-md
          bg-[var(--color-surface)]
          dark:bg-[var(--color-brand-600)]
          shadow-2xl rounded-2xl p-8
        "
      >
        {/* BRAND */}
        <div className="text-center">
          <div
            className="
              w-25 h-25 mx-auto rounded-2xl
              flex items-center justify-center
            "
          >
            <img src={Logo} alt="StudyHub logo" className="object-contain" />
          </div>

          <h1 className="text-2xl font-semibold mt-2">StudyHub</h1>
          <p className="text-sm opacity-70">Nền tảng học tập & cộng tác</p>
        </div>

        {/* PAGE TRANSITION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
