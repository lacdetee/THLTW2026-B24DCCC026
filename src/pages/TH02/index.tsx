import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Space } from 'antd';
import { DashboardOutlined, PlayCircleOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';
import Bai1_OanTuTi from './Bai1';
import Bai2_NganHangCauHoi from './Bai2';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout: React.FC = () => {
	const [mucDangChon, datMucDangChon] = useState('bai2');

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider width={250} theme='light' style={{ borderRight: '1px solid #f0f0f0' }}>
				<div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', marginBottom: '10px' }}>
					<Title level={4} style={{ color: '#d9363e', margin: 0 }}>
						LẬP TRÌNH WEB - RIPT
					</Title>
				</div>
				<Menu
					mode='inline'
					selectedKeys={[mucDangChon]}
					onClick={(e) => datMucDangChon(e.key)}
					style={{ borderRight: 0 }}
					items={[
						{ key: 'trangchu', icon: <DashboardOutlined />, label: 'Trang chủ' },
						{ type: 'divider' },
						{ key: 'bai1', icon: <PlayCircleOutlined />, label: 'Oẳn Tù Tì (Bài 1)' },
						{
							key: 'bai2',
							icon: <FormOutlined style={{ color: '#d9363e' }} />,
							label: <span style={{ color: '#d9363e', fontWeight: 'bold' }}>Quản lý Đề Thi (Bài 2)</span>,
						},
					]}
				/>
			</Sider>

			<Layout>
				<Header
					style={{
						background: '#fff',
						padding: '0 24px',
						borderBottom: '1px solid #f0f0f0',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					<Space>
						<Avatar icon={<UserOutlined />} />
						<Text strong>B24DCCC164 - NAM KHÁNH</Text>
					</Space>
				</Header>

				<Content style={{ margin: '24px', background: '#f0f2f5' }}>
					{mucDangChon === 'bai1' && <Bai1_OanTuTi />}
					{mucDangChon === 'bai2' && <Bai2_NganHangCauHoi />}
					{mucDangChon === 'trangchu' && (
						<div style={{ textAlign: 'center', marginTop: 50 }}>
							<Title level={3}>Chào mừng đến với bài thực hành TH02</Title>
						</div>
					)}
				</Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
