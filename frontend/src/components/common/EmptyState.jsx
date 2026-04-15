const EmptyState = ({ title, description, action }) => (
  <div className="glass-card rounded-3xl p-8 text-center text-slate-200">
    <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
    <p className="mt-3 text-sm text-slate-300">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
