import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import TabSoVanBang from './components/TabSoVanBang';
import TabCauHinh from './components/TabCauHinh';
import TabVanBang from './components/TabVanBang';
import TabTraCuu from './components/TabTraCuu';

const { TabPane } = Tabs;
const { Title } = Typography;

const TH04_QuanLyVanBang: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <Title level={3} style={{ color: '#1890ff', margin: 0 }}>HỆ THỐNG QUẢN LÝ SỔ VĂN BẰNG TỐT NGHIỆP</Title>
      </div>

      <Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="1" type="card" size="large">
          <TabPane tab={<span style={{ fontWeight: 'bold' }}>📚 1. Quản Lý Sổ & QĐ</span>} key="1">
            <TabSoVanBang />
          </TabPane>
          <TabPane tab={<span style={{ fontWeight: 'bold' }}>⚙️ 2. Cấu Hình Phụ Lục</span>} key="2">
            <TabCauHinh />
          </TabPane>
          <TabPane tab={<span style={{ fontWeight: 'bold' }}>🎓 3. Cấp Phát Văn Bằng</span>} key="3">
            <TabVanBang />
          </TabPane>
          <TabPane tab={<span style={{ fontWeight: 'bold' }}>🔍 4. Tra Cứu & Thống Kê</span>} key="4">
            <TabTraCuu />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default TH04_QuanLyVanBang;