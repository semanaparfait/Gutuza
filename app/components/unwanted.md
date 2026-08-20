        {/* Search & Filter Hero Box */}
        <div className="mt-10 max-w-4xl mx-auto bg-[#192724]/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-emerald-900/50 shadow-2xl shadow-black/40">
          
          {/* Transaction Type Tabs */}
          <div className="flex items-center gap-2 mb-4 px-2 border-b border-emerald-900/40 pb-3">
            {['All', 'Rent', 'Sale', 'Service'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedType === t
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                }`}
              >
                {t === 'All' ? 'All Listings' : t === 'Rent' ? 'For Rent' : t === 'Sale' ? 'For Sale' : 'Services'}
              </button>
            ))}
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Keyword Search */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Asset name (e.g. Caterpillar excavator)"
                className="w-full pl-10 pr-4 py-3 text-xs bg-[#111a18] text-white rounded-xl border border-emerald-900/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Location Picker */}
            <div className="sm:col-span-4 relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="City / Region (e.g. Kigali)"
                className="w-full pl-10 pr-4 py-3 text-xs bg-[#111a18] text-white rounded-xl border border-emerald-900/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* CTA Button */}
            <div className="sm:col-span-3">
              <button
                onClick={onSearch}
                className="w-full h-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                Find Assets
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        {/* <div className="mt-8 flex items-center justify-center gap-2 flex-wrap max-w-5xl mx-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-[#192724] hover:bg-emerald-950/80 text-slate-200 border border-emerald-900/40'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div> */}



                {/* Trust Badges Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>100% Verified</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">KYC & Asset Inspection</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Escrow Security</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Protected Payments</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-base">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Instant Booking</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Direct Owner Chat</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-base">
              <Tractor className="w-5 h-5 text-emerald-400" />
              <span>5,000+ Assets</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Cross-border Fleet</p>
          </div>
        </div>


        // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA__IHmGvwEa1Rg2XGa5SAp4R-Cbf9rQ9A",
  authDomain: "essetify-496bc.firebaseapp.com",
  projectId: "essetify-496bc",
  storageBucket: "essetify-496bc.firebasestorage.app",
  messagingSenderId: "151613535196",
  appId: "1:151613535196:web:686ea68eb9c608b0cb9519",
  measurementId: "G-XTCDQ12T3J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);