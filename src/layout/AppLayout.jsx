import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    BankOutlined,
    HomeOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    SafetyOutlined,
    MailOutlined,
    TeamOutlined,
    UserOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import useAuth from "../hooks/useAuth.js";

const { Sider, Content } = Layout;

export default function AppLayout() {
    const { pathname } = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const selectedKey = (() => {
        if (pathname.startsWith("/create/event")) return "create-event";
        if (pathname.startsWith("/moderation/emails")) return "moderation-emails";
        if (pathname.startsWith("/moderation")) return "moderation";
        return pathname.split("/")[1] || "home";
    })();

    const menuItems = [
        { key: "home", icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
        { key: "events", icon: <CalendarOutlined />, label: <Link to="/events">Eventi</Link> },
        { key: "clubs", icon: <TeamOutlined />, label: <Link to="/clubs">Club</Link> },
        { key: "users", icon: <UserOutlined />, label: <Link to="/users">Persone</Link> },
        { key: "messages", icon: <MessageOutlined />, label: <Link to="/messages">Messaggi</Link> },
        { key: "create-event", icon: <PlusCircleOutlined />, label: <Link to="/create/event">Proponi</Link> },
    ];

    if (isAdmin) {
        menuItems.push(
            { key: "universita", icon: <BankOutlined />, label: <Link to="/universita">Universita</Link> },
            { key: "moderation", icon: <SafetyOutlined />, label: <Link to="/moderation/queue">Moderazione</Link> },
            { key: "moderation-emails", icon: <MailOutlined />, label: <Link to="/moderation/emails">Email history</Link> }
        );
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div style={{ color: "#fff", padding: 16, fontWeight: 700 }}>UniHub</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                />
            </Sider>

            <Layout>
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
