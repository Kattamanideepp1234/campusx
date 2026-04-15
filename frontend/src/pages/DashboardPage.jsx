import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Spinner from "../components/common/Spinner";
import StatCard from "../components/common/StatCard";
import { initialAssetForm } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { createAsset, deleteAsset, fetchAssets, updateAsset } from "../services/assetService";
import { fetchBookings, fetchRevenueAnalytics } from "../services/bookingService";
import { currency } from "../utils/formatters";

const DashboardPage = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assetForm, setAssetForm] = useState(initialAssetForm);
  const [editingId, setEditingId] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [{ bookings: bookingData }, { assets: assetData }] = await Promise.all([fetchBookings(), fetchAssets()]);
      setBookings(bookingData);
      setAssets(assetData);

      if (user.role === "admin") {
        const { analytics: stats } = await fetchRevenueAnalytics();
        setAnalytics(stats);
      }

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const totalSpent = useMemo(() => bookings.reduce((sum, booking) => sum + booking.totalAmount, 0), [bookings]);

  const handleAssetFormChange = (event) => {
    const { name, value } = event.target;
    setAssetForm((current) => ({ ...current, [name]: value }));
  };

  const handleAssetSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...assetForm,
      pricePerHour: Number(assetForm.pricePerHour),
      capacity: Number(assetForm.capacity),
      amenities: assetForm.amenities.split(",").map((item) => item.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await updateAsset(editingId, payload);
        notify("Asset updated successfully.", "success");
      } else {
        await createAsset(payload);
        notify("Asset created successfully.", "success");
      }

      setAssetForm(initialAssetForm);
      setEditingId(null);
      loadDashboard();
    } catch (err) {
      notify(err.response?.data?.message || "Unable to save asset.", "error");
    }
  };

  const handleEditAsset = (asset) => {
    setEditingId(asset._id);
    setAssetForm({
      ...asset,
      amenities: asset.amenities.join(", "),
    });
  };

  const handleDeleteAsset = async (id) => {
    try {
      await deleteAsset(id);
      notify("Asset deleted successfully.", "success");
      loadDashboard();
    } catch (err) {
      notify(err.response?.data?.message || "Unable to delete asset.", "error");
    }
  };

  if (loading) {
    return <Spinner fullScreen label="Loading your dashboard..." />;
  }

  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-neon">Dashboard</p>
          <h1 className="mt-3 font-display text-4xl text-white">Hello, {user.name}</h1>
          <p className="mt-3 text-slate-300">Role: {user.role}. Manage assets, bookings, and platform activity from one place.</p>
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        {user.role === "admin" ? (
          <>
            <div className="grid gap-5 md:grid-cols-4">
              <StatCard label="Revenue" value={currency(analytics?.totalRevenue)} helper="Across confirmed and pending bookings" />
              <StatCard label="Bookings" value={analytics?.confirmedBookings || 0} helper="Confirmed reservations" />
              <StatCard label="Assets" value={analytics?.activeAssets || 0} helper="Active monetized spaces" />
              <StatCard label="Occupancy" value={`${analytics?.occupancyRate || 0}%`} helper="Current utilization index" />
            </div>

            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <form onSubmit={handleAssetSubmit} className="glass-card rounded-[2rem] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-neon">Asset Control</p>
                    <h2 className="mt-2 font-display text-3xl text-white">{editingId ? "Edit asset" : "Add a new asset"}</h2>
                  </div>
                  {editingId ? <button type="button" onClick={() => { setEditingId(null); setAssetForm(initialAssetForm); }} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Reset</button> : null}
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input name="title" value={assetForm.title} onChange={handleAssetFormChange} placeholder="Asset title" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                  <input name="type" value={assetForm.type} onChange={handleAssetFormChange} placeholder="Type" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                  <input name="location" value={assetForm.location} onChange={handleAssetFormChange} placeholder="Location" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                  <input name="pricePerHour" value={assetForm.pricePerHour} onChange={handleAssetFormChange} placeholder="Price per hour" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                  <input name="capacity" value={assetForm.capacity} onChange={handleAssetFormChange} placeholder="Capacity" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                  <input name="image" value={assetForm.image} onChange={handleAssetFormChange} placeholder="Image URL" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
                  <input name="amenities" value={assetForm.amenities} onChange={handleAssetFormChange} placeholder="Amenities, comma separated" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
                  <textarea name="description" value={assetForm.description} onChange={handleAssetFormChange} rows="4" placeholder="Describe the space" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none md:col-span-2" />
                </div>
                <button className="mt-6 rounded-full bg-gradient-to-r from-skywave to-pulse px-6 py-3 font-semibold text-white">
                  {editingId ? "Update Asset" : "Create Asset"}
                </button>
              </form>

              <div className="glass-card rounded-[2rem] p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-neon">Inventory</p>
                <h2 className="mt-2 font-display text-3xl text-white">Manage listed assets</h2>
                <div className="mt-6 space-y-4">
                  {assets.map((asset) => (
                    <div key={asset._id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-display text-2xl text-white">{asset.title}</h3>
                          <p className="mt-1 text-sm text-slate-300">{asset.location} • {asset.type} • {currency(asset.pricePerHour)}/hr</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleEditAsset(asset)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Edit</button>
                          <button onClick={() => handleDeleteAsset(asset._id)} className="rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-200">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!assets.length ? <EmptyState title="No assets listed yet" description="Add your first classroom, lab, or auditorium to begin monetizing inventory." /> : null}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {user.role !== "admin" ? (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <StatCard label="Bookings" value={bookings.length} helper="Reservations in your account" />
              <StatCard label="Spend" value={currency(totalSpent)} helper="Total booking value" />
              <StatCard label="Profile" value={user.role} helper={user.collegeName} />
            </div>
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-card rounded-[2rem] p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-neon">My Bookings</p>
                <h2 className="mt-2 font-display text-3xl text-white">Track your reservations</h2>
                <div className="mt-6 space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-display text-2xl text-white">{booking.assetTitle}</h3>
                          <p className="mt-1 text-sm text-slate-300">{booking.date} • {booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">{currency(booking.totalAmount)}</p>
                          <p className="text-sm text-slate-400">Status: {booking.status} • Payment: {booking.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!bookings.length ? <EmptyState title="No bookings yet" description="Head to the asset listing page to reserve a venue." /> : null}
                </div>
              </div>
              <div className="glass-card rounded-[2rem] p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-neon">Profile</p>
                <h2 className="mt-2 font-display text-3xl text-white">Account overview</h2>
                <div className="mt-6 rounded-[1.5rem] bg-white/5 p-5">
                  <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-3xl object-cover" />
                  <h3 className="mt-4 font-display text-2xl text-white">{user.name}</h3>
                  <p className="mt-2 text-slate-300">{user.email}</p>
                  <p className="mt-2 text-slate-300">{user.collegeName}</p>
                  <p className="mt-2 text-slate-300">{user.phone}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default DashboardPage;
