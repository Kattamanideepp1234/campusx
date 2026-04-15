import { motion } from "framer-motion";

const SectionHeading = ({ eyebrow, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    className="max-w-2xl"
  >
    <p className="text-sm font-semibold uppercase tracking-[0.38em] text-neon">{eyebrow}</p>
    <h2 className="mt-4 font-display text-3xl font-semibold text-white md:text-5xl">{title}</h2>
    {description ? <p className="mt-4 text-base leading-7 text-slate-300">{description}</p> : null}
  </motion.div>
);

export default SectionHeading;
