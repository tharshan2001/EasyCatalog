import React, { useState } from "react";
import { Download, Upload, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import RecentProductsTable from "../components/dashboard/RecentProductsTable";
import DashboardCounts from "../components/dashboard/DashboardCounts";
import api from "../store/api";

const DashboardPage = () => {
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleBackup = async () => {
    try {
      setBackingUp(true);
      const response = await api.get("/backup", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const disposition = response.headers["content-disposition"];
      const match = disposition && disposition.match(/filename="?(.+?)"?$/);
      link.download = match ? match[1] : `backup-${Date.now()}.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Backup failed");
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestoreClick = () => {
    if (restoring) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip,application/zip";
    input.style.position = "fixed";
    input.style.top = "-100px";
    input.style.left = "-100px";
    input.style.opacity = "0";
    input.addEventListener("change", (e) => {
      const file = e.target?.files?.[0];
      document.body.removeChild(input);
      if (file) handleRestore(file);
    });
    document.body.appendChild(input);
    input.click();
  };

  const handleRestore = async (file) => {
    const result = await Swal.fire({
      title: "Restore Database?",
      text: "This will replace ALL current products and categories with the backup data. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E74C3C",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, restore it!",
    });

    if (!result.isConfirmed) return;

    try {
      setRestoring(true);
      const formData = new FormData();
      formData.append("backup", file);
      const { data } = await api.post("/backup/restore", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(
        `Restored ${data.categoriesRestored} categories and ${data.productsRestored} products`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Restore failed");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="bg-[#F4F6FA] p-6 lg:p-12 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Statistics Section */}
        <section>
          <div className="flex items-end justify-between border-b border-[#E0E4EB] pb-4 mb-6">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#7F8C9D] font-bold">
              Platform Overview
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRestoreClick}
                disabled={restoring}
                className="flex items-center gap-2 bg-white hover:bg-[#F4F6FA] text-[#2C3E50] border border-[#E0E4EB] px-6 py-3 text-[8px] font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
              >
                {restoring ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {restoring ? "Restoring..." : "Restore Backup"}
              </button>
              <button
                onClick={handleBackup}
                disabled={backingUp}
                className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-6 py-3 text-[8px] font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
              >
                {backingUp ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                {backingUp ? "Creating Backup..." : "Download Backup"}
              </button>
            </div>
          </div>
          <DashboardCounts />
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#E0E4EB] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#2C3E50]">
                Recently Added Products
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] mt-1 font-bold">
                Latest entries to the collection
              </p>
            </div>
          </div>
          
          <RecentProductsTable />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
