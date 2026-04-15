import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info } from "lucide-react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = "info") => {
    const id = crypto.randomUUID();
    setNotifications((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 3500);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-3">
        <AnimatePresence>
          {notifications.map((item) => {
            const Icon = item.type === "success" ? CheckCircle2 : item.type === "error" ? CircleAlert : Info;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.94 }}
                className="glass-card flex items-start gap-3 rounded-2xl p-4"
              >
                <Icon className="mt-0.5 text-neon" size={20} />
                <p className="text-sm text-slate-100">{item.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
