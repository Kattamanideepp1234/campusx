import { LoaderCircle } from "lucide-react";

const Spinner = ({ label = "Loading...", fullScreen = false }) => {
  const wrapperClass = fullScreen
    ? "flex min-h-screen items-center justify-center bg-hero px-6"
    : "flex items-center justify-center py-10";

  return (
    <div className={wrapperClass}>
      <div className="glass-card flex items-center gap-3 rounded-full px-5 py-3 text-sm text-slate-100">
        <LoaderCircle className="animate-spin text-neon" size={18} />
        <span>{label}</span>
      </div>
    </div>
  );
};

export default Spinner;
