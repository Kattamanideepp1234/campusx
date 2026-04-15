import { MapPin, Users } from "lucide-react";
import { currency } from "../../utils/formatters";

const AssetCard = ({ asset, onBook }) => (
  <div className="glass-card overflow-hidden rounded-[2rem]">
    <img src={asset.image} alt={asset.title} className="h-56 w-full object-cover" />
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neon">{asset.type}</p>
          <h3 className="mt-2 font-display text-2xl text-white">{asset.title}</h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-2 text-sm text-slate-100">Available</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
        <span><MapPin className="mr-2 inline" size={16} />{asset.location}</span>
        <span><Users className="mr-2 inline" size={16} />Up to {asset.capacity}</span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{asset.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Starting from</p>
          <p className="text-2xl font-semibold text-white">{currency(asset.pricePerHour)}<span className="text-sm text-slate-400"> / hour</span></p>
        </div>
        <button onClick={() => onBook(asset)} className="rounded-full bg-gradient-to-r from-skywave to-pulse px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">
          Book Now
        </button>
      </div>
    </div>
  </div>
);

export default AssetCard;
