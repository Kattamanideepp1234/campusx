import api from "./api";

export const fetchAssets = async (params) => {
  const { data } = await api.get("/assets", { params });
  return data;
};

export const createAsset = async (payload) => {
  const { data } = await api.post("/assets", payload);
  return data;
};

export const updateAsset = async (id, payload) => {
  const { data } = await api.put(`/assets/${id}`, payload);
  return data;
};

export const deleteAsset = async (id) => {
  const { data } = await api.delete(`/assets/${id}`);
  return data;
};
