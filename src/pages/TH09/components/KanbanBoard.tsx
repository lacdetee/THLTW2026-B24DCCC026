import { ClockCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag, Typography, message } from 'antd';
import { useMemo } from 'react';
import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';
import { useModel } from 'umi';
import { FormTask } from '.';

const { Text, Title } = Typography;

const PRIORITY_COLORS: Record<string, string> = { high: 'red', medium: 'orange', low: 'green' };
const PRIORITY_LABELS: Record<string, string> = { high: 'Cao', medium: 'TB', low: 'Thấp' };

const COLUMNS: { id: Kanban.TaskStatus; title: string; color: string; bgColor: string }[] = [
	{ id: 'todo', title: 'Cần làm', color: '#595959', bgColor: '#fafafa' },
	{ id: 'in_progress', title: 'Đang làm', color: '#1890ff', bgColor: '#e6f7ff' },
	{ id: 'done', title: 'Hoàn thành', color: '#52c41a', bgColor: '#f6ffed' },
];

const KanbanBoard = () => {
	const { tasks, updateTasks, setRecord, setIsEdit, visible, setVisible } = useModel('kanban');

	const groupedTasks = useMemo(() => {
		const groups: Record<string, Kanban.ITask[]> = { todo: [], in_progress: [], done: [] };
		tasks.forEach((t: Kanban.ITask) => {
			if (groups[t.status]) groups[t.status].push(t);
		});
		return groups;
	}, [tasks]);

	const handleDragEnd = (result: DropResult) => {
		const { source, destination, draggableId } = result;
		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		const newTasks = tasks.map((t: Kanban.ITask) =>
			t.id === draggableId ? { ...t, status: destination.droppableId as Kanban.TaskStatus } : t,
		);
		updateTasks(newTasks);
	};

	const handleDelete = (taskId: string) => {
		const newTasks = tasks.filter((t: Kanban.ITask) => t.id !== taskId);
		updateTasks(newTasks);
		message.success('Xóa task thành công!');
	};

	const isOverdue = (task: Kanban.ITask) => {
		const today = new Date().toISOString().split('T')[0];
		return task.status !== 'done' && task.deadline < today;
	};

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => { setRecord(undefined); setIsEdit(false); setVisible(true); }}
				>
					Thêm Task
				</Button>
			</div>

			<DragDropContext onDragEnd={handleDragEnd}>
				<div style={{ display: 'flex', gap: 16, overflowX: 'auto', minHeight: 500 }}>
					{COLUMNS.map((col) => (
						<div
							key={col.id}
							style={{
								flex: 1,
								minWidth: 280,
								background: col.bgColor,
								borderRadius: 12,
								padding: 12,
								border: `2px solid ${col.color}20`,
							}}
						>
							<div style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 12,
								padding: '8px 12px',
								background: col.color + '15',
								borderRadius: 8,
							}}>
								<Title level={5} style={{ margin: 0, color: col.color }}>
									{col.title}
								</Title>
								<Tag color={col.color} style={{ borderRadius: 12, fontWeight: 600 }}>
									{groupedTasks[col.id]?.length || 0}
								</Tag>
							</div>

							<Droppable droppableId={col.id}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										style={{
											minHeight: 400,
											borderRadius: 8,
											padding: 4,
											background: snapshot.isDraggingOver ? col.color + '10' : 'transparent',
											transition: 'background 0.2s',
										}}
									>
										{groupedTasks[col.id]?.map((task: Kanban.ITask, index: number) => (
											<Draggable key={task.id} draggableId={task.id} index={index}>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={{
															...provided.draggableProps.style,
															marginBottom: 8,
															background: snapshot.isDragging ? '#fff' : '#fff',
															borderRadius: 10,
															padding: 14,
															boxShadow: snapshot.isDragging
																? '0 8px 24px rgba(0,0,0,0.15)'
																: '0 1px 4px rgba(0,0,0,0.08)',
															border: isOverdue(task) ? '2px solid #ff4d4f' : '1px solid #f0f0f0',
															transition: 'box-shadow 0.2s',
														}}
													>
														<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
															<Text strong style={{ fontSize: 14, flex: 1 }}>{task.name}</Text>
															<div style={{ display: 'flex', gap: 2 }}>
																<Button
																	type='text'
																	size='small'
																	icon={<EditOutlined />}
																	onClick={(e) => { e.stopPropagation(); setRecord(task); setIsEdit(true); setVisible(true); }}
																/>
																<Popconfirm title='Xóa task này?' onConfirm={() => handleDelete(task.id)} placement='topRight'>
																	<Button type='text' size='small' danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
																</Popconfirm>
															</div>
														</div>
														{task.description && (
															<Text type='secondary' style={{ fontSize: 12, display: 'block', marginBottom: 8 }} ellipsis>
																{task.description}
															</Text>
														)}
														<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
															<div>
																<Tag color={PRIORITY_COLORS[task.priority]} style={{ fontSize: 11 }}>{PRIORITY_LABELS[task.priority]}</Tag>
																<Tag style={{ fontSize: 11 }}>{task.tag}</Tag>
															</div>
															<Text type={isOverdue(task) ? 'danger' : 'secondary'} style={{ fontSize: 11 }}>
																<ClockCircleOutlined style={{ marginRight: 4 }} />
																{new Date(task.deadline).toLocaleDateString('vi-VN')}
															</Text>
														</div>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					))}
				</div>
			</DragDropContext>

			<Modal destroyOnClose footer={false} title={null} visible={visible} onCancel={() => setVisible(false)} width={600} bodyStyle={{ padding: 0 }}>
				<FormTask />
			</Modal>
		</div>
	);
};

export default KanbanBoard;
