import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ClipboardList, Calendar, DollarSign, RefreshCw, Box, AlertCircle } from "lucide-react";

function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

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

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-4 shadow-sm">
        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Sign in to view orders</h2>
        <p className="text-gray-500">You must be logged in to access your order history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order History</h1>
        <button
          onClick={fetchOrders}
          className="p-2.5 hover:bg-slate-100 text-gray-600 rounded-xl transition flex items-center gap-1.5 font-semibold text-sm cursor-pointer border border-gray-100"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-500 space-y-4 shadow-sm">
          <Box className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-lg font-medium">No orders found.</p>
          <p className="text-sm text-gray-400">Items you purchase will appear here once checked out.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6"
            >
              {/* Order Info Row */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-50 pb-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Reference</p>
                  <p className="font-mono text-sm text-gray-900 font-semibold">{order._id}</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center sm:text-right">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Placed</p>
                    <p className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Value</p>
                    <p className="text-base font-extrabold text-blue-600">₹{order.totalAmount}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-lg border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-900">Purchased Items</p>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg bg-slate-50"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-gray-300">
                            <Box className="w-6 h-6 stroke-[1.5]" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.product?.name || "Product"}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">₹{(item.product?.price || 0) * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;