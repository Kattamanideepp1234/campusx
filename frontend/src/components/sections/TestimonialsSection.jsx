import { testimonials } from "../../data/landingContent";
import SectionHeading from "../common/SectionHeading";

const TestimonialsSection = () => (
  <section className="px-4 py-16 md:px-8">
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        eyebrow="Momentum"
        title="Trusted by colleges and organizers"
        description="CampusX is designed to feel premium on the front end and operationally useful behind the scenes."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.map((item) => (
          <div key={item.name} className="glass-card rounded-[2rem] p-6">
            <p className="text-lg leading-8 text-slate-100">“{item.quote}”</p>
            <div className="mt-6">
              <p className="font-display text-xl text-white">{item.name}</p>
              <p className="text-sm text-slate-400">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
