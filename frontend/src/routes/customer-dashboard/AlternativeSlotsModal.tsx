import React, { useState } from "react";
import dayjs from "dayjs";
import { api } from "../../services/api";
import { Button, Typography, Alert, Modal, List, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface Suggestion {
  painter: {
    id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  message: string;
}

interface AlternativeSlotsModalProps {
  open: boolean;
  suggestions: Suggestion[];
  onClose: () => void;
  onBooked?: () => void;
  apiBase?: string;
}

const AlternativeSlotsModal: React.FC<AlternativeSlotsModalProps> = ({
  open,
  suggestions,
  onClose,
  onBooked,
  // api base handled centrally in api service
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isBooking, setIsBooking] = useState(false);

  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    setIsBooking(true);
    try {
      const response = await api.post(`/booking-request`, {
        startTime: suggestion.startTime,
        endTime: suggestion.endTime,
      });

      messageApi.success(
        `🎯 Suggested booking confirmed! Smart system selected: ${response.data.painter.id.toUpperCase()} (${
          response.data.painter.name
        })`,
        4
      );
      if (onBooked) {
        onBooked();
      }
      onClose();
    } catch {
      messageApi.error(
        "Failed to book the suggested time. It may have been taken by another customer."
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <span>
            <ClockCircleOutlined style={{ marginRight: "8px" }} />
            Alternative Time Suggestions
          </span>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <Alert
          message="Your requested time isn't available"
          description="Here are the nearest available time slots. Click on any suggestion to book it instantly!"
          type="warning"
          showIcon
          style={{ marginBottom: "16px" }}
        />

        <List
          dataSource={suggestions}
          renderItem={(suggestion, index) => (
            <List.Item
              key={index}
              actions={[
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  loading={isBooking}
                >
                  Book This Time
                </Button>,
              ]}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                avatar={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
                title={
                  <div>
                    <Text strong>
                      {dayjs(suggestion.startTime).format("MMMM D, YYYY")}
                    </Text>
                    <Text style={{ marginLeft: "8px", color: "#666" }}>
                      {dayjs(suggestion.startTime).format("HH:mm")} -{" "}
                      {dayjs(suggestion.endTime).format("HH:mm")}
                    </Text>
                  </div>
                }
                description={
                  <div>
                    <Text>Painter: {suggestion.painter.name}</Text>
                    <br />
                    <Text type="secondary">{suggestion.message}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default AlternativeSlotsModal;
