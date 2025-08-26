import React, { useState, useEffect } from 'react';
import { Row, Col, Card, DatePicker, TimePicker, Button, Table, message, Typography, Alert } from 'antd';
import { PlusOutlined, CalendarOutlined, BookOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

const { Title } = Typography;

interface Availability {
  id: string;
  startTime: string;
  endTime: string;
}

interface Booking {
  bookingId: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface PainterDashboardProps {
  painterId: string;
}

const PainterDashboard: React.FC<PainterDashboardProps> = ({ painterId }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    fetchAvailabilities();
    fetchBookings();
  }, [painterId]);

  const fetchAvailabilities = async () => {
    try {
      const response = await axios.get(`${API_BASE}/availability/me?painterId=${painterId}`);
      setAvailabilities(response.data);
    } catch (error) {
      message.error('Failed to fetch availabilities');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/bookings/painter?painterId=${painterId}`);
      setBookings(response.data);
    } catch (error) {
      message.error('Failed to fetch bookings');
    }
  };

  const handleAddAvailability = async () => {
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
      await axios.post(`${API_BASE}/availability`, {
        painterId,
        startTime,
        endTime
      });
      message.success('Availability added successfully');
      fetchAvailabilities();
      setSelectedDate(null);
      setTimeRange(null);
    } catch (error) {
      message.error('Failed to add availability');
    } finally {
      setLoading(false);
    }
  };

  const availabilityColumns = [
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
  ];

  const bookingColumns = [
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
          {status.toUpperCase()}
        </span>
      ),
    },
  ];

  const getPainterIcon = (painterId: string) => {
    const icons: { [key: string]: string } = {
      'painter-1': '🎨',
      'painter-2': '🖌️',
      'painter-3': '🖍️',
      'painter-4': '🖊️'
    };
    return icons[painterId] || '🎨';
  };

  const getPainterName = (painterId: string) => {
    const names: { [key: string]: string } = {
      'painter-1': 'Painter 1',
      'painter-2': 'Painter 2', 
      'painter-3': 'Painter 3',
      'painter-4': 'Painter 4'
    };
    return names[painterId] || painterId;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Alert
            message={`Welcome ${getPainterIcon(painterId)} ${getPainterName(painterId)}!`}
            description="Manage your availability and view your bookings below. The system will automatically assign you to compatible booking requests."
            type="success"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        </Col>
        <Col span={24}>
          <Card>
            <Title level={3}>
              <CalendarOutlined /> Add Availability
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
                  icon={<PlusOutlined />}
                  onClick={handleAddAvailability}
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  Add Availability
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Title level={3}>
              <CalendarOutlined /> My Availability
            </Title>
            <Table
              columns={availabilityColumns}
              dataSource={availabilities}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Title level={3}>
              <BookOutlined /> My Bookings
            </Title>
            <Table
              columns={bookingColumns}
              dataSource={bookings}
              rowKey="bookingId"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PainterDashboard;