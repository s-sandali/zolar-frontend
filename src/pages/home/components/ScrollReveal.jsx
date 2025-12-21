import { motion } from "framer-motion";

const ScrollReveal = ({ children, delay = 0, y = 40 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
