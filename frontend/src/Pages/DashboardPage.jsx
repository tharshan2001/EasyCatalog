import React from "react";
import RecentProductsTable from "../components/dashboard/RecentProductsTable";
import DashboardCounts from "../components/dashboard/DashboardCounts";

const DashboardPage = () => {
  return (
    <div className="bg-[#F4F6FA] p-6 lg:p-12 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Statistics Section */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#7F8C9D] font-bold mb-6">
            Platform Overview
          </h2>
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