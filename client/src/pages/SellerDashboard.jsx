import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Store, ShoppingBag, ClipboardList, DollarSign, Plus, ArrowRight, BarChart2, Calendar, User, Package } from "lucide-react";

function SellerDashboard() {
  const { token, user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load seller dashboard details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Packed":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Shipped":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
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
        <BarChart2 className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500">Only sellers are authorized to view the dashboard page.</p>
      </div>
    );
  }

  if (!data) return <h2 className="text-center text-gray-500">Failed to load dashboard data.</h2>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Seller Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor your shop sales, product inventory, and customer orders.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Shops Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">My Shops</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{data.totalShops}</p>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">My Products</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{data.totalProducts}</p>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Incoming Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{data.totalOrders}</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">My Revenue</p>
            <p className="text-2xl font-black text-gray-900 mt-1">₹{data.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/add-shop"
          className="flex items-center justify-between p-5 border border-gray-100 hover:border-blue-500 rounded-2xl group hover:bg-slate-50 transition bg-white shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Add New Shop</p>
              <p className="text-xs text-gray-500">Create a shop to start listing items</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/my-shops"
          className="flex items-center justify-between p-5 border border-gray-100 hover:border-blue-500 rounded-2xl group hover:bg-slate-50 transition bg-white shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition">
              <Store className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Manage My Shops</p>
              <p className="text-xs text-gray-500">Add products, edit stock, view details</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Incoming Orders List */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            <span>Incoming Store Orders</span>
          </h2>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-100">
            Realtime
          </span>
        </div>

        {!data.orders || data.orders.length === 0 ? (
          <div className="py-12 text-center text-gray-500 space-y-3">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-lg font-medium">No customer orders placed yet.</p>
            <p className="text-sm text-gray-400">When customers purchase items from your shops, they will list here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition space-y-4"
              >
                {/* Order Metadata */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-50 pb-4">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                    <p className="font-mono text-xs text-gray-900 font-semibold">{order._id}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center sm:text-right">
                    <div className="space-y-1 text-left sm:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Details</p>
                      <p className="text-xs text-gray-700 font-semibold flex items-center sm:justify-end gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.user?.name || "Anonymous"} ({order.user?.email})</span>
                      </p>
                    </div>

                    <div className="space-y-1 text-left sm:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Date</p>
                      <p className="text-xs text-gray-700 font-semibold flex items-center sm:justify-end gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div>
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Ordered from this Seller */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    <span>Your Products In Order:</span>
                  </p>
                  <div className="divide-y divide-gray-50 bg-slate-50/50 rounded-xl px-4 py-2 border border-gray-50">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center py-2 text-sm first:pt-1 last:pb-1">
                        <div className="flex items-center gap-2">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-8 h-8 object-cover rounded-md bg-gray-100"
                            />
                          )}
                          <div>
                            <span className="font-semibold text-gray-900">{item.product?.name || "Product"}</span>
                            <span className="text-xs text-gray-400 ml-1.5 font-medium">× {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-gray-950">₹{(item.product?.price || 0) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total amount for this seller */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Share Value:</span>
                  <span className="text-base font-extrabold text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;