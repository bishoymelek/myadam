import React, { useState, useEffect } from 'react';
import { Row, Col, Card, DatePicker, TimePicker, Button, Table, message, Typography, Alert, Modal, List } from 'antd';
import { CalendarOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/bookings/me`);
      setBookings(response.data);
    } catch (error) {
      message.error('Failed to fetch bookings');
    }
  };

  const handleBookingRequest = async () => {
    if (!selectedDate || !timeRange) {
      message.warning('Please select date and time range');
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
      const response = await axios.post(`${API_BASE}/booking-request`, {
        startTime,
        endTime
      });
      
      message.success(
        `🎉 Booking confirmed! Smart system selected: ${response.data.painter.id.toUpperCase()} (${response.data.painter.name})`, 
        4
      );
      fetchBookings();
      setSelectedDate(null);
      setTimeRange(null);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        const errorData = error.response.data;
        if (errorData.suggestions && errorData.suggestions.length > 0) {
          setSuggestions(errorData.suggestions);
          setShowSuggestionsModal(true);
          message.warning('No painters available at requested time. Check suggested alternatives!');
        } else {
          message.error('No painters are available for the requested time slot. Please try a different time.');
        }
      } else {
        message.error('Failed to create booking request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/booking-request`, {
        startTime: suggestion.startTime,
        endTime: suggestion.endTime
      });
      
      message.success(
        `🎯 Suggested booking confirmed! Smart system selected: ${response.data.painter.id.toUpperCase()} (${response.data.painter.name})`,
        4
      );
      fetchBookings();
      setShowSuggestionsModal(false);
      setSuggestions([]);
      setSelectedDate(null);
      setTimeRange(null);
    } catch (error: any) {
      message.error('Failed to book the suggested time. It may have been taken by another customer.');
    } finally {
      setLoading(false);
    }
  };

  const bookingColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (id: string) => <Text code>{id.substring(0, 8)}...</Text>,
    },
    {
      title: 'Painter',
      dataIndex: ['painter', 'name'],
      key: 'painterName',
    },
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'date',
      render: (startTime: string) => dayjs(startTime).format('YYYY-MM-DD'),
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: string) => dayjs(startTime).format('HH:mm'),
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: string) => dayjs(endTime).format('HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ 
          color: status === 'confirmed' ? '#52c41a' : '#1890ff',
          fontWeight: 'bold'
        }}>
          <CheckCircleOutlined /> {status.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Alert
            message="Welcome to Adam Painter Booking!"
            description="Select your preferred date and time slot below. Our system will automatically assign the best available painter for your job."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
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
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Col>
              <Col span={10}>
                <TimePicker.RangePicker
                  value={timeRange}
                  onChange={(times) => setTimeRange(times as [Dayjs, Dayjs] | null)}
                  format="HH:mm"
                  placeholder={['Start time', 'End time']}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Button
                  type="primary"
                  icon={<BookOutlined />}
                  onClick={handleBookingRequest}
                  loading={loading}
                  style={{ width: '100%' }}
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

      <Modal
        title={
          <span>
            <ClockCircleOutlined style={{ marginRight: '8px' }} />
            Alternative Time Suggestions
          </span>
        }
        open={showSuggestionsModal}
        onCancel={() => setShowSuggestionsModal(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="Your requested time isn't available"
          description="Here are the nearest available time slots. Click on any suggestion to book it instantly!"
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
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
                  loading={loading}
                >
                  Book This Time
                </Button>
              ]}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                title={
                  <div>
                    <Text strong>
                      {dayjs(suggestion.startTime).format('MMMM D, YYYY')}
                    </Text>
                    <Text style={{ marginLeft: '8px', color: '#666' }}>
                      {dayjs(suggestion.startTime).format('HH:mm')} - {dayjs(suggestion.endTime).format('HH:mm')}
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
    </div>
  );
};

export default CustomerDashboard;