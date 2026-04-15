import { motion } from "framer-motion";
import SectionHeading from "../common/SectionHeading";
import { howItWorks } from "../../data/landingContent";

const HowItWorksSection = () => (
  <section className="px-4 py-16 md:px-8">
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        eyebrow="How CampusX Works"
        title="A monetization workflow built for campus operations teams"
        description="From discovery to payment confirmation, the platform keeps venue utilization and organizer booking journeys in one coordinated flow."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {howItWorks.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-[2rem] p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-neon">
              0{index + 1}
            </div>
            <h3 className="mt-6 font-display text-2xl text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
