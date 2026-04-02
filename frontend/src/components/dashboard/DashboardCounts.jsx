import React, { useEffect, useState } from "react";
import api from "../../store/api.js";
import { Loader2, Archive, Package } from "lucide-react";

export default function DashboardCounts() {
  const [total, setTotal] = useState(null);
  const [archived, setArchived] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      console.log("Fetching dashboard counts...");
      try {
        setLoading(true);

        const totalRes = await api.get("/dashboard/total-products");
        console.log("Total products response:", totalRes.data);
        setTotal(totalRes.data.total);

        const archivedRes = await api.get("/dashboard/archived-products");
        console.log("Archived products response:", archivedRes.data);
        setArchived(archivedRes.data.archived);

      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
        setError("Failed to fetch dashboard counts");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6">
        <Loader2 className="animate-spin text-[#4A90E2]" size={24} />
        <span className="text-[#7F8C9D]">Loading counts...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-[#E74C3C] text-sm py-4">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Products Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E0E4EB] p-6 flex items-center gap-4">
        <div className="p-3 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg">
          <Package size={24} />
        </div>
        <div>
          <p className="text-sm text-[#7F8C9D] uppercase font-bold tracking-wide">Total Products</p>
          <h2 className="text-2xl font-bold text-[#2C3E50]">{total ?? 0}</h2>
        </div>
      </div>

      {/* Archived Products Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E0E4EB] p-6 flex items-center gap-4">
        <div className="p-3 bg-[#E74C3C]/10 text-[#E74C3C] rounded-lg">
          <Archive size={24} />
        </div>
        <div>
          <p className="text-sm text-[#7F8C9D] uppercase font-bold tracking-wide">Archived Products</p>
          <h2 className="text-2xl font-bold text-[#2C3E50]">{archived ?? 0}</h2>
        </div>
      </div>
    </div>
  );
}