import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { api } from "../../services/api";
import {
  Row,
  Col,
  Card,
  DatePicker,
  TimePicker,
  Button,
  Table,
  Typography,
  Alert,
  message,
} from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AlternativeSlotsModal from "./AlternativeSlotsModal";

const { Title, Text } = Typography;

interface Booking {
  bookingId: string;
  painter: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  status: string;
}

interface Suggestion {
  painter: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  message: string;
}

const CustomerDashboard: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  // API base handled centrally in api service

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/bookings/me`);
      const rawData = response.data as unknown;
      if (Array.isArray(rawData)) {
        setBookings(rawData as Booking[]);
      } else {
        setBookings([]);
        messageApi.error("Unexpected response from server for bookings.");
        console.error("/bookings/me unexpected payload:", rawData);
      }
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch bookings";
      messageApi.error(serverMsg);
      // eslint-disable-next-line no-console
      console.error("/bookings/me fetch error:", err);
    }
  };

  const handleBookingRequest = async () => {
    if (!selectedDate || !timeRange) {
      messageApi.warning("Please select date and time range");
      return;
    }

    const startTime = selectedDate
      .hour(timeRange[0].hour())
      .minute(timeRange[0].minute())
      .second(0)
      .toISOString();

    const endTime = selectedDate
      .hour(timeRange[1].hour())
      .minute(timeRange[1].minute())
      .second(0)
      .toISOString();

    setLoading(true);
    try {
      const response = await api.post(`/booking-request`, {
        startTime,
        endTime,
      });

      messageApi.success(
        `🎉 Booking confirmed! Smart system selected: ${response.data.painter.id.toUpperCase()} (${
          response.data.painter.name
        })`,
        4
      );
      fetchBookings();
      setSelectedDate(null);
      setTimeRange(null);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        // Handle duplicate booking error
        messageApi.error(
          error.response.data.error ||
            "You already have a booking that overlaps with this time slot."
        );
      } else if (error.response && error.response.status === 409) {
        const errorData = error.response.data;
        if (errorData.suggestions && errorData.suggestions.length > 0) {
          setSuggestions(errorData.suggestions);
          setShowSuggestionsModal(true);
          messageApi.warning(
            "No painters available at requested time. Check suggested alternatives!"
          );
        } else {
          messageApi.error(
            "No painters are available for the requested time slot. Please try a different time."
          );
        }
      } else {
        messageApi.error("Failed to create booking request");
      }
    } finally {
      setLoading(false);
    }
  };

  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (id: string) => <Text code>{id.substring(0, 8)}...</Text>,
    },
    {
      title: "Painter",
      dataIndex: ["painter", "name"],
      key: "painterName",
    },
    {
      title: "Date",
      dataIndex: "startTime",
      key: "date",
      render: (startTime: string) => dayjs(startTime).format("YYYY-MM-DD"),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: string) => dayjs(startTime).format("HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime: string) => dayjs(endTime).format("HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            color: status === "confirmed" ? "#52c41a" : "#1890ff",
            fontWeight: "bold",
          }}
        >
          <CheckCircleOutlined /> {status.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {contextHolder}

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Alert
            message="Welcome to Adam Painter Booking!"
            description="Select your preferred date and time slot below. Our system will automatically assign the best available painter for your job."
            type="info"
            showIcon
            style={{ marginBottom: "24px" }}
          />
        </Col>

        <Col span={24}>
          <Card>
            <Title level={3}>
              <CalendarOutlined /> Request a Paint Job
            </Title>

            <Row gutter={[16, 16]} align="middle">
              <Col span={6}>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Select date"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Col>
              <Col span={10}>
                <TimePicker.RangePicker
                  value={timeRange}
                  onChange={(times) =>
                    setTimeRange(times as [Dayjs, Dayjs] | null)
                  }
                  format="HH:mm"
                  placeholder={["Start time", "End time"]}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  icon={<BookOutlined />}
                  onClick={handleBookingRequest}
                  loading={loading}
                  style={{ width: "100%" }}
                  size="large"
                >
                  Request Booking
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Title level={3}>
              <BookOutlined /> My Bookings
            </Title>

            {bookings.length === 0 ? (
              <Alert
                message="No bookings yet"
                description="When you make your first booking request, it will appear here."
                type="info"
                showIcon
              />
            ) : (
              <Table
                columns={bookingColumns}
                dataSource={bookings}
                rowKey="bookingId"
                pagination={false}
                size="middle"
              />
            )}
          </Card>
        </Col>
      </Row>

      <AlternativeSlotsModal
        open={showSuggestionsModal}
        suggestions={suggestions}
        onClose={() => setShowSuggestionsModal(false)}
        onBooked={() => {
          fetchBookings();
          setSuggestions([]);
          setSelectedDate(null);
          setTimeRange(null);
        }}
      />
    </div>
  );
};

export default CustomerDashboard;
