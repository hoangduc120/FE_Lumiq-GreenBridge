import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  TeamOutlined,
  SettingOutlined,
  TagsOutlined,
  CaretDownFilled,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.data.user);
      } catch (err) {
        // If not logged in or error, redirect to login
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "h/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Menu items
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Bảng điều khiển</Link>,
    },
    {
      key: "packages",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/manage-package">Quản lý gói</Link>,
    },
    {
      key: "voucher",
      icon: <TagsOutlined />,
      label: <Link to="/admin/manage-voucher">Quản lý voucher</Link>,
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/manage-products">Sản phẩm</Link>,
    },
    {
      key: "add category",
      icon: <CaretDownFilled />,
      label: <Link to="/admin/add-category">Thêm danh mục</Link>,
    },
    {
      key: "manage gardener profile",
      icon: <TeamOutlined />,
      label: <Link to="/admin/manage-gardener-profile">Quản lý hồ sơ chủ vườn</Link>,
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: <Link to="/admin/manage-users">Người dùng</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt</Link>,
    },
  ];

  // Get active menu key
  const getActiveKey = () => {
    if (location.pathname === "/admin") return "dashboard";
    if (location.pathname.includes("manage-package")) return "packages";
    if (location.pathname.includes("add-category")) return "add-category";
    if (location.pathname.includes("manage-voucher")) return "voucher";
    if (location.pathname.includes("manage-products")) return "products";
    if (location.pathname.includes("manage-users")) return "users";
    if (location.pathname.includes("settings")) return "settings";
    return "dashboard";
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          background: "linear-gradient(180deg, #2B8B35 0%, #1e6b28 100%)",
        }}
      >
        <div className="logo p-4 flex items-center justify-center">
          <h1 className="text-white text-xl font-bold">
            {collapsed ? "GB" : "GreenBridge Admin"}
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          style={{
            background: "transparent",
            borderRight: 0,
          }}
          className="custom-menu"
        />
        <style>{`
          .custom-menu .ant-menu-item {
            color: rgba(255, 255, 255, 0.85);
            margin: 4px 0;
          }
          .custom-menu .ant-menu-item:hover {
            color: white;
            background: rgba(255, 255, 255, 0.1);
          }
          .custom-menu .ant-menu-item-selected {
            background-color: rgba(255, 255, 255, 0.2) !important;
            color: white;
          }
          .custom-menu .ant-menu-item-selected::after {
            border-right: 3px solid #6bde8f !important;
          }
          .custom-menu .ant-menu-item .ant-menu-item-icon {
            color: rgba(255, 255, 255, 0.85);
          }
          .custom-menu .ant-menu-item-selected .ant-menu-item-icon {
            color: white;
          }
        `}</style>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <div className="flex items-center">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "profile",
                    icon: <UserOutlined />,
                    label: <Link to="/profile">Hồ sơ</Link>,
                  },
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: <span onClick={handleLogout}>Đăng xuất</span>,
                  },
                ],
              }}
              placement="bottomRight"
              arrow
            >
              <div className="cursor-pointer flex items-center">
                <span className="mr-2">{user.fullName || "Quản trị viên"}</span>
                <Avatar
                  src={user.avatar}
                  icon={!user.avatar && <UserOutlined />}
                />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: 8,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
