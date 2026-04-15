import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import Spinner from "../components/common/Spinner";
import { roleOptions } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const AuthPage = ({ mode = "login" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: isLogin ? "user@campusx.com" : "",
    password: isLogin ? "password123" : "",
    role: "user",
    collegeName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        notify("Welcome back to CampusX.", "success");
      } else {
        await signup(formData);
        notify("Your CampusX account is ready.", "success");
      }

      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-neon">{isLogin ? "Welcome Back" : "New Partner Onboard"}</p>
          <h1 className="mt-4 font-display text-4xl text-white">{isLogin ? "Login to CampusX" : "Create your CampusX account"}</h1>
          <p className="mt-4 text-slate-300">
            {isLogin ? "Access dashboards, bookings, and asset monetization analytics." : "Join the platform as a college admin, organizer, or user and start managing inventory instantly."}
          </p>
          <div className="mt-8 space-y-4 text-sm text-slate-300">
            <p>Demo accounts are pre-seeded so you can explore all three roles immediately.</p>
            <p>`admin@campusx.com` | `organizer@campusx.com` | `user@campusx.com`</p>
            <p>Password: `password123`</p>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin ? (
              <div>
                <label className="mb-2 block text-sm text-slate-300">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="Aditi Rao" />
              </div>
            ) : null}
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="you@college.edu" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="Enter your password" />
            </div>
            {!isLogin ? (
              <>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-neon/60">
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">College Name</label>
                  <input name="collegeName" value={formData.collegeName} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="CampusX Innovation University" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-neon/60" placeholder="+91 9876543210" />
                </div>
              </>
            ) : null}
            {error ? <ErrorMessage message={error} /> : null}
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-skywave via-neon to-pulse px-5 py-3 font-semibold text-slate-950 disabled:opacity-70">
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
            <p className="text-center text-sm text-slate-300">
              {isLogin ? "Need an account?" : "Already registered?"}{" "}
              <Link to={isLogin ? "/signup" : "/login"} className="font-semibold text-neon">
                {isLogin ? "Sign up" : "Login"}
              </Link>
            </p>
          </form>
          {loading ? <Spinner label="Authenticating..." /> : null}
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
