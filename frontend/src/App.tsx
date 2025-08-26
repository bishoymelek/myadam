import { useState } from "react";
import { Layout, Menu, Card, Select, App as AntApp } from "antd";
import { UserOutlined, FormatPainterFilled } from "@ant-design/icons";
import PainterDashboard from "./routes/painter-dashboard/PainterDashboard";
import CustomerDashboard from "./routes/customer-dashboard";

const { Header, Content } = Layout;
const { Option } = Select;

type UserType = "painter" | "customer" | null;

function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedPainterId, setSelectedPainterId] =
    useState<string>("painter-1");

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  const resetUserType = () => {
    setUserType(null);
  };

  if (!userType) {
    return (
      <AntApp>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
          <Header style={{ textAlign: "center", backgroundColor: "#1890ff" }}>
            <h1 style={{ color: "white", margin: 0, lineHeight: "64px" }}>
              🎨 Adam Painter Booking System
            </h1>
          </Header>

          <Content
            style={{
              padding: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <Card hoverable style={{ width: 300, textAlign: "center" }}>
              <FormatPainterFilled
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                  marginBottom: "16px",
                }}
              />
              <h2>I'm a Painter</h2>
              <p>Manage your availability and view bookings</p>
              <div style={{ marginTop: "16px" }}>
                <Select
                  style={{ width: "100%", marginBottom: "12px" }}
                  value={selectedPainterId}
                  onChange={setSelectedPainterId}
                  placeholder="Select Painter ID"
                >
                  <Option value="painter-1">🎨 Painter 1</Option>
                  <Option value="painter-2">🖌️ Painter 2</Option>
                  <Option value="painter-3">🖍️ Painter 3</Option>
                  <Option value="painter-4">🖊️ Painter 4</Option>
                </Select>
                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#1890ff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => handleUserTypeSelect("painter")}
                >
                  Enter as {selectedPainterId}
                </button>
              </div>
            </Card>

            <Card
              hoverable
              style={{ width: 300, textAlign: "center" }}
              onClick={() => handleUserTypeSelect("customer")}
            >
              <UserOutlined
                style={{
                  fontSize: "48px",
                  color: "#52c41a",
                  marginBottom: "16px",
                }}
              />
              <h2>I'm a Customer</h2>
              <p>Book painting services for your needs</p>
            </Card>
          </Content>
        </Layout>
      </AntApp>
    );
  }

  return (
    <AntApp>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1890ff",
          }}
        >
          <h1 style={{ color: "white", margin: 0, flex: 1 }}>
            🎨 Adam Painter Booking -{" "}
            {userType === "painter"
              ? `${selectedPainterId} Dashboard`
              : "Customer Portal"}
          </h1>

          <Menu
            theme="dark"
            mode="horizontal"
            style={{ backgroundColor: "transparent", borderBottom: "none" }}
          >
            <Menu.Item key="back" onClick={resetUserType}>
              Back to Home
            </Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: "24px" }}>
          {userType === "painter" ? (
            <PainterDashboard painterId={selectedPainterId} />
          ) : (
            <CustomerDashboard />
          )}
        </Content>
      </Layout>
    </AntApp>
  );
}

export default App;
