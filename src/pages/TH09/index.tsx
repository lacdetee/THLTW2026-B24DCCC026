import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { Dashboard, KanbanBoard, TaskList } from './components';

const { TabPane } = Tabs;

const KanbanPage = () => {
	const { activeTab, setActiveTab, getDataTasks } = useModel('kanban');

	useEffect(() => {
		getDataTasks();
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
				<TabPane tab='Kanban Board' key='kanban'>
					<KanbanBoard />
				</TabPane>
				<TabPane tab='Danh sách Task' key='danh-sach'>
					<TaskList />
				</TabPane>
			</Tabs>
		</Card>
	);
};

export default KanbanPage;
