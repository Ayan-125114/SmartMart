import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Store, MapPin, Navigation, ArrowLeft, Plus } from "lucide-react";

function AddShop() {
  const { token, user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLat] = useState("");
  const [longitude, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingGeo, setFetchingGeo] = useState(false);
  const navigate = useNavigate();

  // Autodetect location on mount to help the user
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (navigator.geolocation) {
      setFetchingGeo(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLng(position.coords.longitude.toString());
          setFetchingGeo(false);
        },
        (err) => {
          console.warn("Could not get location", err);
          setFetchingGeo(false);
        }
      );
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !address || !latitude || !longitude) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      await api.post(
        "/shops/",
        {
          shopName: name,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Shop Created Successfully!");
      navigate("/my-shops");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shop.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || user?.role !== "seller") {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-4 shadow-sm">
        <Store className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only sellers are authorized to register a new shop storefront.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 space-y-6">
      {/* Back Button */}
      <Link
        to="/my-shops"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Shops</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-slate-100/50">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Register Store</h1>
          <p className="text-gray-500">List your shop on the map so customers can find and order from you</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shop Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Store className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Grocers & Bakers"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <MapPin className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                placeholder="e.g. 123 Market Road, Sector 5"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
              />
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-950 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Geographic Location</span>
              </span>
              <button
                type="button"
                onClick={detectLocation}
                disabled={fetchingGeo}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 disabled:text-gray-400 bg-white border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
              >
                {fetchingGeo ? "Getting location..." : "Auto-fill Current Location"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 28.6139"
                  value={latitude}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 77.2090"
                  value={longitude}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Create Shop Listing</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddShop;