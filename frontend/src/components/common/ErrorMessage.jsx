import { AlertTriangle } from "lucide-react";

const ErrorMessage = ({ message }) => (
  <div className="glass-card flex items-center gap-3 rounded-2xl border border-rose-400/40 p-4 text-sm text-rose-100">
    <AlertTriangle size={18} />
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
