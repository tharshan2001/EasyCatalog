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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white border border-[#E0E4EB] rounded-sm">
        <Loader2 className="animate-spin text-[#4A90E2]" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-2 border-[#E74C3C] p-4 text-[#E74C3C] text-xs">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-dashed border-[#E0E4EB] rounded-sm">
        <Package size={32} className="mx-auto text-[#E0E4EB] mb-2" />
        <p className="font-medium text-[#7F8C9D] text-sm">No recent entries found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-[#E0E4EB] rounded-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#F4F6FA] border-b border-[#E0E4EB]">
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Code</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Product Name</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Price</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Tags</th>
            <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Added On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E0E4EB]">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-[#F4F6FA] transition-colors">
              <td className="px-5 py-4 text-[11px] font-mono text-[#7F8C9D] uppercase">{product.code || "N/A"}</td>
              <td className="px-5 py-4">
                <span className="text-sm font-medium text-[#2C3E50]">{product.name}</span>
              </td>
              <td className="px-5 py-4 text-sm font-medium text-[#2C3E50]">
                LKR {product.price.toLocaleString()}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {product.tags?.length > 0 ? (
                    product.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-medium text-[#4A90E2] bg-[#4A90E2]/10 px-2 py-0.5 rounded-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-[#7F8C9D]">-</span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4 text-[10px] font-semibold text-[#7F8C9D] uppercase tracking-wider">
                {formatDate(product.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}