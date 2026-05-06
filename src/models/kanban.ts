import { useState } from 'react';

const SEED_TASKS: Kanban.ITask[] = [
	{ id: 't1', name: 'Thiết kế giao diện Dashboard', description: 'Tạo mockup cho trang Dashboard bao gồm các thẻ thống kê và biểu đồ', deadline: '2026-05-10', priority: 'high', status: 'done', tag: 'Design', createdAt: '2026-04-25' },
	{ id: 't2', name: 'Viết API đăng nhập', description: 'Xây dựng endpoint POST /auth/login với JWT token', deadline: '2026-05-08', priority: 'high', status: 'done', tag: 'Backend', createdAt: '2026-04-26' },
	{ id: 't3', name: 'Tích hợp React Query', description: 'Cài đặt và cấu hình React Query cho việc fetching data', deadline: '2026-05-12', priority: 'medium', status: 'in_progress', tag: 'Frontend', createdAt: '2026-04-27' },
	{ id: 't4', name: 'Viết unit test cho UserService', description: 'Viết test cases cho các method trong UserService', deadline: '2026-05-15', priority: 'medium', status: 'in_progress', tag: 'Testing', createdAt: '2026-04-28' },
	{ id: 't5', name: 'Tối ưu hóa database query', description: 'Thêm index và tối ưu các câu query chậm', deadline: '2026-05-05', priority: 'high', status: 'todo', tag: 'Backend', createdAt: '2026-04-29' },
	{ id: 't6', name: 'Responsive cho trang sản phẩm', description: 'Điều chỉnh layout responsive cho mobile và tablet', deadline: '2026-05-18', priority: 'low', status: 'todo', tag: 'Frontend', createdAt: '2026-04-30' },
	{ id: 't7', name: 'Viết tài liệu API', description: 'Tạo documentation cho tất cả các API endpoints bằng Swagger', deadline: '2026-05-20', priority: 'low', status: 'todo', tag: 'Docs', createdAt: '2026-05-01' },
	{ id: 't8', name: 'Fix bug phân trang', description: 'Sửa lỗi phân trang hiển thị sai số trang khi filter', deadline: '2026-05-03', priority: 'high', status: 'in_progress', tag: 'Bug', createdAt: '2026-05-02' },
	{ id: 't9', name: 'Deploy lên staging', description: 'Setup CI/CD pipeline và deploy ứng dụng lên môi trường staging', deadline: '2026-05-22', priority: 'medium', status: 'todo', tag: 'DevOps', createdAt: '2026-05-03' },
	{ id: 't10', name: 'Review code Sprint 3', description: 'Review toàn bộ pull requests của Sprint 3', deadline: '2026-05-04', priority: 'medium', status: 'todo', tag: 'Review', createdAt: '2026-05-04' },
];

const initSeedData = () => {
	if (!localStorage.getItem('kanban_tasks')) {
		localStorage.setItem('kanban_tasks', JSON.stringify(SEED_TASKS));
	}
};

export default () => {
	const [tasks, setTasks] = useState<Kanban.ITask[]>([]);
	const [record, setRecord] = useState<Kanban.ITask>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<string>('dashboard');

	const getDataTasks = () => {
		initSeedData();
		const data: Kanban.ITask[] = JSON.parse(localStorage.getItem('kanban_tasks') as string) || [];
		setTasks(data);
	};

	const updateTasks = (newTasks: Kanban.ITask[]) => {
		localStorage.setItem('kanban_tasks', JSON.stringify(newTasks));
		setTasks(newTasks);
	};

	return {
		tasks, setTasks, getDataTasks, updateTasks,
		record, setRecord,
		isEdit, setIsEdit,
		visible, setVisible,
		activeTab, setActiveTab,
	};
};
