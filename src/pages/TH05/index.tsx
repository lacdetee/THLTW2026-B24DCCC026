import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import {
  HomeOutlined,
  FormOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import TabCauLacBo from './components/TabCauLacBo';
import TabDonDangKy from './components/TabDonDangKy';
import TabThanhVien from './components/TabThanhVien';
import TabThongKe from './components/TabThongKe';

const { TabPane } = Tabs;
const { Title } = Typography;

const QuanLyCLB: React.FC = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 24 }}>
        🏫 HỆ THỐNG QUẢN LÝ CÂU LẠC BỘ
      </Title>

      <Card bordered={false} style={{ borderRadius: '8px' }}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane
            tab={
              <span>
                <HomeOutlined /> Danh sách CLB
              </span>
            }
            key="1"
          >
            <TabCauLacBo />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FormOutlined /> Đơn đăng ký
              </span>
            }
            key="2"
          >
            <TabDonDangKy />
          </TabPane>

          <TabPane
            tab={
              <span>
                <TeamOutlined /> Thành viên
              </span>
            }
            key="3"
          >
            <TabThanhVien />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined /> Thống kê
              </span>
            }
            key="4"
          >
            <TabThongKe />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default QuanLyCLB;