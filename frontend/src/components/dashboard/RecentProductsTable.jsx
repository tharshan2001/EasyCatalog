import React, { useEffect, useState } from "react";
import api from "../../store/api.js";
import { Loader2, Package } from "lucide-react";

export default function RecentProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/recent-products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setError("The archive could not be reached at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white border border-slate-100 rounded-sm">
        <Loader2 className="animate-spin text-sky-500" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-2 border-red-400 p-4 text-red-800 text-xs italic">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-sm">
        <Package size={32} className="mx-auto text-slate-200 mb-2" />
        <p className="font-serif italic text-slate-400 text-sm">No recent entries found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-sky-50 border-b border-slate-200">
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Code</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Product Name</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Price</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Tags</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-sky-50/50 transition-colors">
              <td className="px-5 py-4 text-[11px] font-mono text-slate-400 uppercase">{product.code || "N/A"}</td>
              <td className="px-5 py-4">
                <span className="text-sm font-serif font-medium text-sky-900">{product.name}</span>
              </td>
              <td className="px-5 py-4 text-sm font-medium text-slate-700 font-serif">
                LKR {product.price.toLocaleString()}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {product.tags?.length > 0 ? (
                    product.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] italic text-slate-300">No tags</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}