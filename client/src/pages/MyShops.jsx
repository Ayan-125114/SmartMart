import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Store, Plus, MapPin, Eye, ArrowRight } from "lucide-react";

function MyShops() {
  const { token, user } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadShops();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadShops = async () => {
    setLoading(true);
    try {
      const res = await api.get("/shops/my-shops", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShops(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-8 h-8"></span>
      </div>
    );
  }

  if (!token || user?.role !== "seller") {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-4 shadow-sm">
        <Store className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only registered sellers can manage their shop listings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Shops</h1>
          <p className="text-gray-500 mt-1">Manage and view your storefronts and product inventories.</p>
        </div>
        <Link
          to="/add-shop"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Shop</span>
        </Link>
      </div>

      {/* Grid */}
      {shops.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-500 space-y-4 shadow-sm max-w-xl mx-auto">
          <Store className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-lg font-medium">You don't own any shops yet.</p>
          <p className="text-sm text-gray-400">Click the button below to register your first retail storefront.</p>
          <Link
            to="/add-shop"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <span>Create Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    Active
                  </span>
                  {shop.location?.coordinates && (
                    <span className="text-xs text-gray-400 font-medium">
                      Lat: {shop.location.coordinates[1]?.toFixed(3)}, Lng: {shop.location.coordinates[0]?.toFixed(3)}
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

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-end">
                <Link
                  to={`/shop/${shop._id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Manage Products</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyShops;