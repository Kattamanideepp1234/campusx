const StatCard = ({ label, value, helper }) => (
  <div className="glass-card rounded-3xl p-5">
    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{label}</p>
    <h3 className="mt-3 font-display text-3xl font-semibold text-white">{value}</h3>
    {helper ? <p className="mt-2 text-sm text-slate-300">{helper}</p> : null}
  </div>
);

export default StatCard;
