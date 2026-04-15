import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="flex min-h-[70vh] items-center justify-center px-4 py-10 text-center md:px-8">
    <div className="glass-card max-w-xl rounded-[2rem] p-10">
      <p className="text-sm uppercase tracking-[0.3em] text-neon">404</p>
      <h1 className="mt-4 font-display text-4xl text-white">This page drifted off campus</h1>
      <p className="mt-4 text-slate-300">The route you tried does not exist. Let’s get you back to the active parts of the platform.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-skywave to-pulse px-6 py-3 font-semibold text-white">
        Return Home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
