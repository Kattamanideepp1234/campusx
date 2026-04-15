import mongoose from "mongoose";
import { store } from "../data/store.js";
import { Asset } from "../models/Asset.js";
import { generateId } from "../utils/generateId.js";

const applyFilters = (assets, filters) => {
  const { location, type, minPrice, maxPrice, capacity, search } = filters;

  return assets.filter((asset) => {
    const matchesLocation = location ? asset.location.toLowerCase().includes(location.toLowerCase()) : true;
    const matchesType = type ? asset.type === type : true;
    const matchesMinPrice = minPrice ? asset.pricePerHour >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? asset.pricePerHour <= Number(maxPrice) : true;
    const matchesCapacity = capacity ? asset.capacity >= Number(capacity) : true;
    const matchesSearch = search
      ? [asset.title, asset.description, asset.location, ...(asset.amenities || [])]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;
    return matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice && matchesCapacity && matchesSearch;
  });
};

const sortAssets = (assets, sortBy = "latest") => {
  const sortedAssets = [...assets];

  switch (sortBy) {
    case "price_asc":
      return sortedAssets.sort((a, b) => a.pricePerHour - b.pricePerHour);
    case "price_desc":
      return sortedAssets.sort((a, b) => b.pricePerHour - a.pricePerHour);
    case "capacity_desc":
      return sortedAssets.sort((a, b) => b.capacity - a.capacity);
    case "title_asc":
      return sortedAssets.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedAssets.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
};

export const getAssets = async (req, res) => {
  const assets = await store.getAssets();
  const filteredAssets = applyFilters(assets.filter((asset) => asset.isActive !== false), req.query);
  const sortedAssets = sortAssets(filteredAssets, req.query.sortBy);
  res.json({ assets: sortedAssets });
};

export const getAssetById = async (req, res) => {
  const assets = await store.getAssets();
  const asset = assets.find((item) => item._id.toString() === req.params.id);

  if (!asset) {
    return res.status(404).json({ message: "Asset not found." });
  }

  return res.json({ asset });
};

export const createAsset = async (req, res) => {
  const assetPayload = {
    _id: generateId("asset"),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    const asset = await Asset.create(assetPayload);
    return res.status(201).json({ message: "Asset created successfully.", asset });
  }

  const assets = await store.getAssets();
  await store.saveAssets([assetPayload, ...assets]);
  return res.status(201).json({ message: "Asset created successfully.", asset: assetPayload });
};

export const updateAsset = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    return res.json({ message: "Asset updated successfully.", asset });
  }

  const assets = await store.getAssets();
  const assetIndex = assets.findIndex((item) => item._id.toString() === req.params.id);

  if (assetIndex === -1) {
    return res.status(404).json({ message: "Asset not found." });
  }

  assets[assetIndex] = { ...assets[assetIndex], ...req.body };
  await store.saveAssets(assets);
  return res.json({ message: "Asset updated successfully.", asset: assets[assetIndex] });
};

export const deleteAsset = async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    return res.json({ message: "Asset deleted successfully." });
  }

  const assets = await store.getAssets();
  const nextAssets = assets.filter((item) => item._id.toString() !== req.params.id);

  if (nextAssets.length === assets.length) {
    return res.status(404).json({ message: "Asset not found." });
  }

  await store.saveAssets(nextAssets);
  return res.json({ message: "Asset deleted successfully." });
};
