import { motion } from "framer-motion";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredMetrics } from "../../data/landingContent";

const HeroSection = () => (
  <section className="px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-neon">
          <Sparkles size={16} />
          Monetize unused campus spaces with confidence
        </div>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
          Unlock College <span className="text-gradient">Infrastructure</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          CampusX turns idle classrooms, labs, auditoriums, and sports venues into bookable revenue streams for colleges and seamless venues for organizers.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link to="/assets" className="rounded-full bg-gradient-to-r from-skywave via-neon to-pulse px-7 py-4 text-center font-semibold text-slate-950 shadow-glow transition hover:scale-[1.02]">
            Explore Assets
            <ArrowRight className="ml-2 inline" size={18} />
          </Link>
          <Link to="/signup" className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-center font-semibold text-white transition hover:border-neon/60 hover:bg-white/10">
            List Your College
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {featuredMetrics.map((item) => (
            <div key={item.label} className="glass-card rounded-3xl p-5">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
        <div className="absolute -left-10 top-8 hidden h-40 w-40 rounded-full bg-neon/20 blur-3xl md:block" />
        <div className="absolute -bottom-8 right-0 hidden h-48 w-48 rounded-full bg-pulse/20 blur-3xl md:block" />
        <div className="glass-card relative overflow-hidden rounded-[2rem] p-6">
          <div className="rounded-[1.7rem] border border-white/10 bg-slate-950/30 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-neon">Live Monetization</p>
                <h3 className="mt-2 font-display text-2xl text-white">Weekend Asset Booking</h3>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-neon">
                <Building2 size={24} />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Innovation Auditorium</span>
                  <span className="text-neon">Booked</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-skywave to-neon" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Monthly Revenue</p>
                  <p className="mt-3 text-3xl font-semibold text-white">?18.4L</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Occupancy Lift</p>
                  <p className="mt-3 text-3xl font-semibold text-white">74%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
