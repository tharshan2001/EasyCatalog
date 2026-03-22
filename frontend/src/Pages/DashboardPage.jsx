import React from "react";
import RecentProductsTable from "../components/dashboard/RecentProductsTable";
import DashboardCounts from "../components/dashboard/DashboardCounts";

const DashboardPage = () => {
  return (
    <div className=" bg-sky-50 p-6 lg:p-12 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Statistics Section */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mb-6">
            Platform Overview
          </h2>
          <DashboardCounts />
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-serif text-sky-900">
                Recently Added Products
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1 font-bold">
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