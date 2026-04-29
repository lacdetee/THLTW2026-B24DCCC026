import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { Dashboard, NhatKyChiSo, NhatKyTapLuyen, QuanLyMucTieu, ThuVienBaiTap } from './components';

const { TabPane } = Tabs;

const FitnessPage = () => {
	const { activeTab, setActiveTab, getDataWorkouts, getDataHealth, getDataGoals, getDataExercises } = useModel('fitness');

	useEffect(() => {
		getDataWorkouts();
		getDataHealth();
		getDataGoals();
		getDataExercises();
	}, []);

	return (
		<Card bodyStyle={{ padding: '12px 24px' }}>
			<Tabs
				activeKey={activeTab}
				onChange={(key) => setActiveTab(key)}
				type='card'
				size='large'
			>
				<TabPane tab='Dashboard' key='dashboard'>
					<Dashboard />
				</TabPane>
				<TabPane tab='Nhật ký tập luyện' key='nhat-ky-tap'>
					<NhatKyTapLuyen />
				</TabPane>
				<TabPane tab='Chỉ số sức khỏe' key='chi-so'>
					<NhatKyChiSo />
				</TabPane>
				<TabPane tab='Mục tiêu' key='muc-tieu'>
					<QuanLyMucTieu />
				</TabPane>
				<TabPane tab='Thư viện bài tập' key='thu-vien'>
					<ThuVienBaiTap />
				</TabPane>
			</Tabs>
		</Card>
	);
};

export default FitnessPage;
