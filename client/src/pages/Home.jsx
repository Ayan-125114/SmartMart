import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { MapPin, Search, Navigation, AlertCircle, Eye, ArrowRight, Star } from "lucide-react";

function Home() {
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [radius, setRadius] = useState(5000); // 5km
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    // Get geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          fetchNearbyShops(lat, lng, radius);
        },
        (error) => {
          console.warn("Geolocation denied or failed. Displaying all shops.", error);
          setGeoError("Location access denied or unavailable. Displaying all stores in the system.");
          setCoords(null);
          fetchNearbyShops("", "", radius);
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser. Displaying all stores in the system.");
      setCoords(null);
      fetchNearbyShops("", "", radius);
    }
  }, [radius]);

  const fetchNearbyShops = async (lat, lng, r) => {
    setLoadingShops(true);
    try {
      // radius is handled by the backend's maxDistance or custom radius parameter
      const res = await api.get(`/shops/nearby?lat=${lat}&lng=${lng}&radius=${r}`);
      setShops(res.data);
    } catch (err) {
      console.error("Failed to load nearby shops", err);
    } finally {
      setLoadingShops(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/products/search?q=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-xl shadow-blue-100/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
            Local Delivery Made Simple
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Discover Stores & Products Near You
          </h1>
          <p className="text-blue-100 text-lg">
            Find local businesses, shop online from your favorite neighborhood vendors, and enjoy ultra-fast delivery.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products or categories (e.g. Apples, Electronics...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 hover:bg-black text-white font-semibold px-8 py-4 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Geolocation Alert */}
      {geoError && (
        <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-2xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Notice:</span> {geoError}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searching ? "Searching products..." : `Search Results for "${searchQuery}"`}
            </h2>
            <button
              onClick={clearSearch}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Clear Results
            </button>
          </div>

          {searching ? (
            <div className="flex justify-center py-12">
              <span className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-8 h-8"></span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="group bg-slate-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 transition shadow-xs hover:shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-xl bg-gray-100"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        No Image Available
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {product.category || "General"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-2 group-hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">₹{product.price}</span>
                    <Link
                      to={`/shop/${product.shop}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Shop</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nearby Shops Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span>Nearby Stores</span>
            </h2>
            <p className="text-gray-500 mt-1">Discover shops near your current physical coordinates</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Range:</span>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value={1000}>Within 1 km</option>
              <option value={5000}>Within 5 km</option>
              <option value={10000}>Within 10 km</option>
              <option value={50000}>Within 50 km</option>
            </select>
          </div>
        </div>

        {loadingShops ? (
          <div className="flex justify-center py-16">
            <span className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-8 h-8"></span>
          </div>
        ) : shops.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-500 space-y-4 shadow-sm">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-lg font-medium">No shops found within the selected radius.</p>
            <p className="text-sm text-gray-400">Try expanding the range selector or check your GPS location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white border border-gray-100 hover:border-gray-200 rounded-3xl p-6 transition shadow-sm hover:shadow-lg flex flex-col justify-between hover:-translate-y-1 duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>4.5</span>
                    </span>
                    {coords && shop.location?.coordinates && (
                      <span className="text-xs text-gray-400 font-medium">
                        Coordinates: {shop.location.coordinates[1]?.toFixed(3)}, {shop.location.coordinates[0]?.toFixed(3)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {shop.shopName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>{shop.address}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (shop.location?.coordinates) {
                        const [lng, lat] = shop.location.coordinates;
                        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
                      }
                    }}
                    className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                    title="Track store location on Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Track on Map</span>
                  </button>
                  <Link
                    to={`/shop/${shop._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;