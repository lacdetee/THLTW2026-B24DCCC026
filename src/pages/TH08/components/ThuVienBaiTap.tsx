import { DeleteOutlined, EditOutlined, FireOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Input, Modal, Popconfirm, Row, Select, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { FormBaiTapThuVien } from '.';

const { Title, Text, Paragraph } = Typography;

const DIFFICULTY_LABELS: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
const DIFFICULTY_COLORS: Record<string, string> = { easy: 'green', medium: 'orange', hard: 'red' };

const ThuVienBaiTap = () => {
	const { exercises, getDataExercises, setRecord, setIsEdit, visible, setVisible } = useModel('fitness');
	const [searchText, setSearchText] = useState('');
	const [filterMuscle, setFilterMuscle] = useState<string | undefined>(undefined);
	const [filterDiff, setFilterDiff] = useState<string | undefined>(undefined);
	const [detailExercise, setDetailExercise] = useState<Fitness.IExercise | null>(null);

	const filteredExercises = useMemo(() => {
		return exercises.filter((e: Fitness.IExercise) => {
			const matchSearch = !searchText || e.name.toLowerCase().includes(searchText.toLowerCase());
			const matchMuscle = !filterMuscle || e.muscleGroup === filterMuscle;
			const matchDiff = !filterDiff || e.difficulty === filterDiff;
			return matchSearch && matchMuscle && matchDiff;
		});
	}, [exercises, searchText, filterMuscle, filterDiff]);

	const handleDelete = (record: Fitness.IExercise) => {
		const dataLocal: Fitness.IExercise[] = JSON.parse(localStorage.getItem('fitness_exercises') as string) || [];
		const newData = dataLocal.filter((item) => item.id !== record.id);
		localStorage.setItem('fitness_exercises', JSON.stringify(newData));
		message.success('Xóa bài tập thành công!');
		getDataExercises();
	};

	const muscleGroups: Fitness.MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
				<Input
					placeholder='Tìm kiếm bài tập...'
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 250 }}
					allowClear
				/>
				<Select
					placeholder='Nhóm cơ'
					value={filterMuscle}
					onChange={(val) => setFilterMuscle(val)}
					style={{ width: 160 }}
					allowClear
				>
					{muscleGroups.map((g) => (
						<Select.Option key={g} value={g}>{g}</Select.Option>
					))}
				</Select>
				<Select
					placeholder='Mức độ khó'
					value={filterDiff}
					onChange={(val) => setFilterDiff(val)}
					style={{ width: 150 }}
					allowClear
				>
					<Select.Option value='easy'>Dễ</Select.Option>
					<Select.Option value='medium'>Trung bình</Select.Option>
					<Select.Option value='hard'>Khó</Select.Option>
				</Select>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => { setRecord(undefined); setIsEdit(false); setVisible(true); }}
				>
					Thêm bài tập
				</Button>
			</div>

			{filteredExercises.length === 0 ? (
				<Empty description='Không tìm thấy bài tập' style={{ padding: 60 }} />
			) : (
				<Row gutter={[16, 16]}>
					{filteredExercises.map((exercise: Fitness.IExercise) => (
						<Col xs={24} sm={12} lg={8} key={exercise.id}>
							<Card
								hoverable
								style={{ borderRadius: 12, height: '100%' }}
								onClick={() => setDetailExercise(exercise)}
								actions={[
									<Button
										key='edit'
										type='text'
										icon={<EditOutlined />}
										size='small'
										onClick={(e) => { e.stopPropagation(); setRecord(exercise); setIsEdit(true); setVisible(true); }}
									>
										Sửa
									</Button>,
									<Popconfirm
										key='delete'
										title='Xóa bài tập này?'
										onConfirm={(e) => { e?.stopPropagation(); handleDelete(exercise); }}
										onCancel={(e) => e?.stopPropagation()}
									>
										<Button type='text' danger icon={<DeleteOutlined />} size='small' onClick={(e) => e.stopPropagation()}>
											Xóa
										</Button>
									</Popconfirm>,
								]}
							>
								<Title level={5} style={{ margin: 0, marginBottom: 8 }}>{exercise.name}</Title>
								<div style={{ marginBottom: 8 }}>
									<Tag color='blue'>{exercise.muscleGroup}</Tag>
									<Tag color={DIFFICULTY_COLORS[exercise.difficulty]}>{DIFFICULTY_LABELS[exercise.difficulty]}</Tag>
								</div>
								<Paragraph type='secondary' ellipsis={{ rows: 2 }} style={{ marginBottom: 8, minHeight: 44 }}>
									{exercise.description}
								</Paragraph>
								<div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f5222d' }}>
									<FireOutlined />
									<Text strong style={{ color: '#f5222d' }}>{exercise.caloriesPerHour} kcal/giờ</Text>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			)}

			<Modal
				visible={!!detailExercise}
				onCancel={() => setDetailExercise(null)}
				footer={null}
				width={600}
				title={detailExercise?.name}
			>
				{detailExercise && (
					<div>
						<div style={{ marginBottom: 16 }}>
							<Tag color='blue'>{detailExercise.muscleGroup}</Tag>
							<Tag color={DIFFICULTY_COLORS[detailExercise.difficulty]}>{DIFFICULTY_LABELS[detailExercise.difficulty]}</Tag>
							<Tag color='red' icon={<FireOutlined />}>{detailExercise.caloriesPerHour} kcal/giờ</Tag>
						</div>
						<Title level={5}>Mô tả</Title>
						<Paragraph>{detailExercise.description}</Paragraph>
						<Title level={5}>Hướng dẫn thực hiện</Title>
						<Paragraph style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{detailExercise.instructions}</Paragraph>
					</div>
				)}
			</Modal>

			<Modal destroyOnClose footer={false} title={null} visible={visible} onCancel={() => setVisible(false)} width={600} bodyStyle={{ padding: 0 }}>
				<FormBaiTapThuVien />
			</Modal>
		</div>
	);
};

export default ThuVienBaiTap;
