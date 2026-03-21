import React, { useState } from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PackageSearch,
  Store,
  Users,
  Settings,
  Package,
  LogOut,
} from "lucide-react";

const { Sider } = Layout;

// Helper for Ant Design Menu items
const getItem = (label, key, icon, children) => ({
  key,
  icon,
  children,
  label,
});

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    getItem(<Link to="/admin/dashboard">Atelier Overview</Link>, "dashboard", <LayoutDashboard size={18} />),
    getItem(
      <span>Store</span>,
      "products",
      <Store size={18} />,
      [
        getItem(<Link to="/admin/product-list">Products</Link>, "prod-active"),
        getItem(<Link to="/admin/category">Category</Link>, "prod-category"),
      ]
    ),
    getItem(<Link to="/admin/order-list">Orders</Link>, "orders", <Package size={18} />),
    getItem(<Link to="/admin/customers">Customers</Link>, "customers", <Users size={18} />),
    getItem(<Link to="/admin/settings">Settings</Link>, "settings", <Settings size={18} />),
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#5C4033",
          colorBgContainer: "#FCF9F6",
          colorText: "#57534e",
          fontFamily: "inherit",
        },
        components: {
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: "#f3e8ff",
            itemSelectedColor: "#5C4033",
            itemHoverBg: "#f5f5f4",
            itemActiveBg: "#f5f5f4",
          },
          Layout: {
            siderBg: "#FCF9F6",
          },
        },
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        className="min-h-screen border-r border-stone-200 relative z-20"
        theme="light"
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-center border-b border-stone-200 mb-4">
          <span className={`font-serif text-[#5C4033] font-bold tracking-tighter transition-all ${collapsed ? "text-xl" : "text-2xl"}`}>
            {collapsed ? "L&C" : "LOOM & CRAFT"}
          </span>
        </div>

        {/* Menu */}
        <Menu
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={items}
          className="border-none px-2 font-medium"
        />

        {/* Logout */}
        <div className="absolute bottom-16 w-full px-4">
          <Link
            to="/admin/logout"
            className={`flex items-center gap-3 text-stone-500 hover:text-red-700 transition-colors w-full p-2 ${collapsed ? "justify-center" : "justify-start"}`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm font-medium">Exit Portal</span>}
          </Link>
        </div>
      </Sider>
    </ConfigProvider>
  );
};

export default Sidebar;