import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    HomeOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    SafetyOutlined,
    MailOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

export default function AppLayout() {
    const { pathname } = useLocation();

    const selectedKey = (() => {
        if (pathname.startsWith("/create/event")) return "create-event";
        if (pathname.startsWith("/moderation/emails")) return "moderation-emails";
        if (pathname.startsWith("/moderation")) return "moderation";
        return pathname.split("/")[1] || "home";
    })();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div style={{ color: "#fff", padding: 16, fontWeight: 700 }}>UniHub</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={[
                        { key: "home", icon: <HomeOutlined />, label: <Link to="/home">Home</Link> },
                        { key: "events", icon: <CalendarOutlined />, label: <Link to="/events">Eventi</Link> },
                        { key: "create-event", icon: <PlusCircleOutlined />, label: <Link to="/create/event">Proponi</Link> },
                        { key: "moderation", icon: <SafetyOutlined />, label: <Link to="/moderation/queue">Moderazione</Link> },
                        { key: "moderation-emails", icon: <MailOutlined />, label: <Link to="/moderation/emails">Email history</Link> },
                    ]}
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
