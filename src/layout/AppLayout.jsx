import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HomeOutlined, CalendarOutlined, PlusCircleOutlined, SafetyOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

function AppLayout() {
    const { pathname } = useLocation();
    const selected = pathname.startsWith("/create/event")
        ? "create-event"
        : pathname.split("/")[1] || "home";

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div style={{ color: "#fff", padding: 16, fontWeight: 700 }}>UniHub</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selected]}
                    items={[
                        { key: "home", icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
                        { key: "events", icon: <CalendarOutlined />, label: <Link to="/events">Eventi</Link> },
                        { key: "create-event", icon: <PlusCircleOutlined />, label: <Link to="/create/event">Proponi</Link> },
                        { key: "moderation", icon: <SafetyOutlined />, label: <Link to="/moderation/queue">Moderazione</Link> },
                    ]}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: 0 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AppLayout;
