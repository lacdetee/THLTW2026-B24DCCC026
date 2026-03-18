import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import TabNhanVienDichVu from './components/TabNhanVienDichVu';
import TabQuanLyLichHen from './components/TabQuanLyLichHen';
import TabDanhGia from './components/TabDanhGia';
import TabThongKe from './components/TabThongKe';

const { TabPane } = Tabs;
const { Title } = Typography;

const TH03_SalonApp: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <Title level={3} style={{ color: '#d9363e', margin: 0 }}>HỆ THỐNG QUẢN LÝ ĐẶT LỊCH BARBER</Title>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>Sinh viên: Nguyễn Đức Minh  | B24DCCC200</span>
      </div>

      <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab={<span style={{ fontWeight: 'bold' }}> 1. Nhân Viên & Dịch Vụ</span>} key="1">
            <TabNhanVienDichVu />
          </TabPane>
          
          <TabPane tab={<span style={{ fontWeight: 'bold' }}> 2. Quản Lý Lịch Hẹn</span>} key="2">
            <TabQuanLyLichHen />
          </TabPane>

          <TabPane tab={<span style={{ fontWeight: 'bold' }}> 3. Phản Hồi & Đánh Giá</span>} key="3">
            <TabDanhGia />
          </TabPane>

          <TabPane tab={<span style={{ fontWeight: 'bold' }}> 4. Thống Kê Báo Cáo</span>} key="4">
            <TabThongKe />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default TH03_SalonApp;