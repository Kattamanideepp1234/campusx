import api from "./api";

export const loginUser = async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

export const signupUser = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
