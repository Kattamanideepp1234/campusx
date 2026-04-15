import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AssetCard from "../components/common/AssetCard";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Spinner from "../components/common/Spinner";
import { assetTypes } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { checkAvailability, createBooking } from "../services/bookingService";
import { fetchAssets } from "../services/assetService";
import { createPayment } from "../services/paymentService";
import { currency } from "../utils/formatters";

const defaultFilters = {
  search: "",
  location: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  capacity: "",
  sortBy: "latest",
};

const AssetsPage = () => {
  const { isAuthenticated } = useAuth();
  const { notify } = useNotification();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [slotStatus, setSlotStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState("success");
  const [bookingForm, setBookingForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "12:00",
    attendees: 20,
    organizerNote: "",
  });

  const loadAssets = async (activeFilters = filters) => {
    try {
      setLoading(true);
      const { assets: data } = await fetchAssets(activeFilters);
      setAssets(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const estimatedPrice = useMemo(() => {
    if (!selectedAsset) return 0;
    const start = Number(bookingForm.startTime.split(":")[0]);
    const end = Number(bookingForm.endTime.split(":")[0]);
    return Math.max(end - start, 1) * selectedAsset.pricePerHour;
  }, [bookingForm.endTime, bookingForm.startTime, selectedAsset]);

  const filterSummary = useMemo(() => {
    const activeEntries = Object.entries(filters).filter(([key, value]) => key !== "sortBy" && value);
    return activeEntries.length ? `${activeEntries.length} active filters` : "No active filters";
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    loadAssets(filters);
  };

  const handleAvailabilityCheck = async () => {
    if (!selectedAsset || !bookingForm.date) {
      notify("Pick a date before checking availability.", "error");
      return;
    }

    try {
      const { available } = await checkAvailability({
        assetId: selectedAsset._id,
        date: bookingForm.date,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
      });
      setSlotStatus(available ? "available" : "unavailable");
      notify(
        available ? "Slot is available for booking." : "Slot is already booked.",
        available ? "success" : "error"
      );
    } catch (err) {
      notify(err.response?.data?.message || "Unable to check availability.", "error");
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      notify("Login to continue with booking.", "error");
      return;
    }

    if (!selectedAsset) return;

    try {
      setSubmitting(true);
      const { booking } = await createBooking({ assetId: selectedAsset._id, ...bookingForm });
      const { payment } = await createPayment({
        bookingId: booking._id,
        amount: booking.totalAmount,
        shouldFail: paymentMode === "failed",
      });

      if (payment.status === "failed") {
        notify("Booking created but the payment simulation failed. You can retry from the dashboard later.", "error");
      } else {
        notify(`Booking confirmed. Transaction ${payment.transactionId} completed successfully.`, "success");
      }

      setSelectedAsset(null);
      setSlotStatus(null);
      setPaymentMode("success");
      setBookingForm({ date: "", startTime: "09:00", endTime: "12:00", attendees: 20, organizerNote: "" });
    } catch (err) {
      notify(err.response?.data?.message || "Booking failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-neon">Asset Marketplace</p>
            <h1 className="mt-3 font-display text-4xl text-white">Explore revenue-ready college spaces</h1>
            <p className="mt-3 text-slate-300">Search, sort, and compare campus venues before locking in a booking slot.</p>
          </div>
          <div className="glass-card rounded-full px-4 py-3 text-sm text-slate-200">{assets.length} assets • {filterSummary}</div>
        </div>

        <form onSubmit={handleApplyFilters} className="glass-card mt-8 grid gap-4 rounded-[2rem] p-5 md:grid-cols-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search assets, amenities, locations"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3 text-white outline-none"
            />
          </div>
          <input name="location" value={filters.location} onChange={handleFilterChange} placeholder="Location" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <select name="type" value={filters.type} onChange={handleFilterChange} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
            <option value="">All Types</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none">
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="capacity_desc">Capacity</option>
            <option value="title_asc">Alphabetical</option>
          </select>
          <button className="rounded-2xl bg-gradient-to-r from-skywave to-pulse px-4 py-3 font-semibold text-white">
            <SlidersHorizontal className="mr-2 inline" size={16} />
            Apply
          </button>
        </form>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <input name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
          <input name="capacity" value={filters.capacity} onChange={handleFilterChange} placeholder="Minimum Capacity" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
        </div>

        <div className="mt-8">
          {loading ? <Spinner label="Loading asset inventory..." /> : null}
          {error ? <ErrorMessage message={error} /> : null}
          {!loading && !error && assets.length === 0 ? <EmptyState title="No assets found" description="Try adjusting filters to discover more spaces." /> : null}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => <AssetCard key={asset._id} asset={asset} onBook={setSelectedAsset} />)}
          </div>
        </div>
      </div>

      {selectedAsset ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
          <div className="glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-neon">Book Asset</p>
                <h2 className="mt-2 font-display text-3xl text-white">{selectedAsset.title}</h2>
                <p className="mt-2 text-slate-300">{selectedAsset.location} • {currency(selectedAsset.pricePerHour)} / hour</p>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Close</button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Date</label>
                <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm((current) => ({ ...current, date: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Attendees</label>
                <input type="number" value={bookingForm.attendees} onChange={(e) => setBookingForm((current) => ({ ...current, attendees: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Start Time</label>
                <input type="time" value={bookingForm.startTime} onChange={(e) => setBookingForm((current) => ({ ...current, startTime: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">End Time</label>
                <input type="time" value={bookingForm.endTime} onChange={(e) => setBookingForm((current) => ({ ...current, endTime: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Organizer Note</label>
                <textarea value={bookingForm.organizerNote} onChange={(e) => setBookingForm((current) => ({ ...current, organizerNote: e.target.value }))} rows="3" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Mention event format, setup, or special requirements." />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Payment Simulation</label>
                <div className="grid gap-3 md:grid-cols-2">
                  <button type="button" onClick={() => setPaymentMode("success")} className={`rounded-2xl border px-4 py-3 text-left ${paymentMode === "success" ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100" : "border-white/10 bg-white/5 text-slate-200"}`}>
                    Simulate successful payment
                  </button>
                  <button type="button" onClick={() => setPaymentMode("failed")} className={`rounded-2xl border px-4 py-3 text-left ${paymentMode === "failed" ? "border-rose-400/60 bg-rose-400/10 text-rose-100" : "border-white/10 bg-white/5 text-slate-200"}`}>
                    Simulate failed payment
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={handleAvailabilityCheck} className="rounded-full border border-neon/40 px-5 py-3 text-sm font-semibold text-neon">Check Availability</button>
              {slotStatus ? <span className={`rounded-full px-4 py-2 text-sm ${slotStatus === "available" ? "bg-emerald-400/15 text-emerald-200" : "bg-rose-400/15 text-rose-200"}`}>{slotStatus === "available" ? "Slot available" : "Slot unavailable"}</span> : null}
            </div>
            <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Estimated payment</p>
                <p className="mt-2 text-3xl font-semibold text-white">{currency(estimatedPrice)}</p>
                <p className="mt-1 text-sm text-slate-400">Mock payment flow with success and failure states</p>
              </div>
              <button onClick={handleBooking} disabled={submitting} className="rounded-full bg-gradient-to-r from-skywave via-neon to-pulse px-6 py-3 font-semibold text-slate-950 disabled:opacity-70">
                {submitting ? "Processing..." : "Confirm Booking & Pay"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AssetsPage;
