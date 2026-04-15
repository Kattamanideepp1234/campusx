const Footer = () => (
  <footer className="px-4 pb-8 pt-12 md:px-8">
    <div className="glass-card mx-auto max-w-7xl rounded-[2rem] px-6 py-8 text-sm text-slate-300 md:flex md:items-center md:justify-between">
      <div>
        <p className="font-display text-xl font-semibold text-white">CampusX</p>
        <p className="mt-2 max-w-lg">Unlock idle campus infrastructure with modern booking, monetization, and analytics workflows.</p>
      </div>
      <div className="mt-6 md:mt-0">
        <p>Demo logins: `admin@campusx.com`, `organizer@campusx.com`, `user@campusx.com`</p>
        <p className="mt-1">Password for all demo accounts: `password123`</p>
      </div>
    </div>
  </footer>
);

export default Footer;
