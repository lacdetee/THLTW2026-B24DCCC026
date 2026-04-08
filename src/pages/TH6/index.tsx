import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import TabKhamPha from './components/TabKhamPha';
import TabLichTrinh from './components/TabLichTrinh';
import TabNganSach from './components/TabNganSach';
import TabQuanTri from './components/TabQuanTri';
import TabThongKe from './components/TabThongKe';
import './style.less';

const { TabPane } = Tabs;
const { Title } = Typography;

const TH06_TravelApp: React.FC = () => {
	return (
		<div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
			<div style={{ marginBottom: 20, textAlign: 'center' }}>
				<Title level={3} style={{ color: '#667eea', margin: 0 }}>ỨNG DỤNG LẬP KẾ HOẠCH DU LỊCH</Title>
			</div>

			<Card bordered={false} bodyStyle={{ padding: '20px' }} style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
				<Tabs defaultActiveKey="1" type="card" size="large">
					<TabPane tab={<span style={{ fontWeight: 'bold' }}>🌍 1. Khám Phá Điểm Đến</span>} key="1">
						<TabKhamPha />
					</TabPane>

					<TabPane tab={<span style={{ fontWeight: 'bold' }}>📋 2. Lịch Trình Du Lịch</span>} key="2">
						<TabLichTrinh />
					</TabPane>

					<TabPane tab={<span style={{ fontWeight: 'bold' }}>💰 3. Quản Lý Ngân Sách</span>} key="3">
						<TabNganSach />
					</TabPane>

					<TabPane tab={<span style={{ fontWeight: 'bold' }}>⚙️ 4. Quản Trị Điểm Đến</span>} key="4">
						<TabQuanTri />
					</TabPane>

					<TabPane tab={<span style={{ fontWeight: 'bold' }}>📊 5. Thống Kê Báo Cáo</span>} key="5">
						<TabThongKe />
					</TabPane>
				</Tabs>
			</Card>
		</div>
	);
};

export default TH06_TravelApp;
