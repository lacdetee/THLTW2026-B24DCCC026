import { useState } from 'react';

const SEED_WORKOUTS: Fitness.IWorkout[] = [
	{ id: 'w1', date: '2026-04-02', type: 'Cardio', duration: 45, calories: 400, note: 'Chạy bộ buổi sáng', status: 'completed' },
	{ id: 'w2', date: '2026-04-04', type: 'Strength', duration: 60, calories: 350, note: 'Tập ngực và vai', status: 'completed' },
	{ id: 'w3', date: '2026-04-06', type: 'Yoga', duration: 30, calories: 150, note: 'Yoga thư giãn', status: 'completed' },
	{ id: 'w4', date: '2026-04-08', type: 'HIIT', duration: 25, calories: 320, note: 'HIIT toàn thân', status: 'completed' },
	{ id: 'w5', date: '2026-04-10', type: 'Cardio', duration: 50, calories: 450, note: 'Đạp xe', status: 'completed' },
	{ id: 'w6', date: '2026-04-12', type: 'Strength', duration: 55, calories: 380, note: 'Tập lưng và tay', status: 'completed' },
	{ id: 'w7', date: '2026-04-14', type: 'HIIT', duration: 20, calories: 280, note: 'Tabata workout', status: 'missed' },
	{ id: 'w8', date: '2026-04-16', type: 'Cardio', duration: 40, calories: 360, note: 'Bơi lội', status: 'completed' },
	{ id: 'w9', date: '2026-04-18', type: 'Strength', duration: 50, calories: 340, note: 'Tập chân', status: 'completed' },
	{ id: 'w10', date: '2026-04-20', type: 'Yoga', duration: 45, calories: 180, note: 'Power Yoga', status: 'completed' },
];

const SEED_HEALTH: Fitness.IHealthMetric[] = [
	{ id: 'h1', date: '2026-04-01', weight: 72, height: 170, bmi: 24.91, heartRate: 72, sleepHours: 7 },
	{ id: 'h2', date: '2026-04-05', weight: 71.5, height: 170, bmi: 24.74, heartRate: 70, sleepHours: 7.5 },
	{ id: 'h3', date: '2026-04-10', weight: 71, height: 170, bmi: 24.57, heartRate: 68, sleepHours: 8 },
	{ id: 'h4', date: '2026-04-15', weight: 70.5, height: 170, bmi: 24.39, heartRate: 67, sleepHours: 7 },
	{ id: 'h5', date: '2026-04-20', weight: 70, height: 170, bmi: 24.22, heartRate: 66, sleepHours: 7.5 },
	{ id: 'h6', date: '2026-04-25', weight: 69.5, height: 170, bmi: 24.05, heartRate: 65, sleepHours: 8 },
];

const SEED_GOALS: Fitness.IGoal[] = [
	{ id: 'g1', name: 'Giảm cân về 65kg', type: 'weight_loss', targetValue: 65, currentValue: 69.5, deadline: '2026-06-30', status: 'in_progress', unit: 'kg' },
	{ id: 'g2', name: 'Bench Press 80kg', type: 'muscle_gain', targetValue: 80, currentValue: 60, deadline: '2026-08-31', status: 'in_progress', unit: 'kg' },
	{ id: 'g3', name: 'Chạy 10km không nghỉ', type: 'endurance', targetValue: 10, currentValue: 7, deadline: '2026-05-31', status: 'in_progress', unit: 'km' },
	{ id: 'g4', name: 'Ngủ đủ 8h mỗi ngày', type: 'other', targetValue: 30, currentValue: 22, deadline: '2026-04-30', status: 'in_progress', unit: 'ngày' },
];

const SEED_EXERCISES: Fitness.IExercise[] = [
	{ id: 'e1', name: 'Push-up', muscleGroup: 'Chest', difficulty: 'easy', description: 'Bài tập hít đất cơ bản', instructions: 'Nằm sấp, hai tay rộng bằng vai. Đẩy người lên cho đến khi tay thẳng. Hạ người xuống từ từ cho đến khi ngực gần chạm sàn. Lặp lại 15-20 lần x 3 hiệp.', caloriesPerHour: 400 },
	{ id: 'e2', name: 'Squat', muscleGroup: 'Legs', difficulty: 'easy', description: 'Bài tập gánh đùi cơ bản', instructions: 'Đứng thẳng, hai chân rộng bằng vai. Hạ hông xuống như đang ngồi ghế. Giữ lưng thẳng, đầu gối không vượt mũi chân. Đứng lên trở lại vị trí ban đầu. Lặp lại 15-20 lần x 3 hiệp.', caloriesPerHour: 500 },
	{ id: 'e3', name: 'Deadlift', muscleGroup: 'Back', difficulty: 'hard', description: 'Nâng tạ từ sàn, tập lưng dưới', instructions: 'Đứng trước thanh tạ, hai chân rộng bằng hông. Gập người xuống nắm thanh tạ. Giữ lưng thẳng, đẩy hông về phía trước để nâng tạ lên. Hạ tạ xuống từ từ. Lặp lại 8-12 lần x 4 hiệp.', caloriesPerHour: 600 },
	{ id: 'e4', name: 'Plank', muscleGroup: 'Core', difficulty: 'easy', description: 'Tập cơ bụng bằng tư thế ván', instructions: 'Nằm sấp, chống hai cẳng tay xuống sàn. Nâng người lên, giữ thân thẳng từ đầu đến gót chân. Siết cơ bụng và giữ tư thế 30-60 giây. Nghỉ 30 giây rồi lặp lại 3 hiệp.', caloriesPerHour: 250 },
	{ id: 'e5', name: 'Bench Press', muscleGroup: 'Chest', difficulty: 'medium', description: 'Đẩy tạ nằm, tập ngực', instructions: 'Nằm trên ghế đẩy tạ, hai chân đặt chắc trên sàn. Nắm thanh tạ rộng hơn vai. Hạ thanh tạ xuống ngực từ từ. Đẩy thanh tạ lên cho đến khi tay thẳng. Lặp lại 8-12 lần x 4 hiệp.', caloriesPerHour: 450 },
	{ id: 'e6', name: 'Pull-up', muscleGroup: 'Back', difficulty: 'hard', description: 'Kéo xà đơn, tập lưng trên', instructions: 'Nắm xà ngang, hai tay rộng hơn vai. Kéo người lên cho đến khi cằm vượt qua xà. Hạ người xuống từ từ cho đến khi tay thẳng hoàn toàn. Lặp lại 8-12 lần x 3 hiệp.', caloriesPerHour: 500 },
	{ id: 'e7', name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'medium', description: 'Đẩy tạ qua đầu, tập vai', instructions: 'Ngồi hoặc đứng, cầm tạ đôi ngang tai. Đẩy tạ lên qua đầu cho đến khi tay thẳng. Hạ tạ xuống từ từ về vị trí ban đầu. Lặp lại 10-15 lần x 3 hiệp.', caloriesPerHour: 400 },
	{ id: 'e8', name: 'Bicep Curl', muscleGroup: 'Arms', difficulty: 'easy', description: 'Cuốn tạ tay trước', instructions: 'Đứng thẳng, cầm tạ đôi hai bên thân. Gập cẳng tay lên, giữ khuỷu tay sát thân. Siết cơ tay trước ở đỉnh. Hạ tạ xuống từ từ. Lặp lại 12-15 lần x 3 hiệp.', caloriesPerHour: 300 },
	{ id: 'e9', name: 'Lunge', muscleGroup: 'Legs', difficulty: 'medium', description: 'Bước chân tập đùi và mông', instructions: 'Đứng thẳng, bước một chân về phía trước. Hạ hông xuống cho đến khi cả hai đầu gối gập 90 độ. Đẩy người lên trở lại vị trí ban đầu. Đổi chân. Lặp lại 12 lần mỗi chân x 3 hiệp.', caloriesPerHour: 450 },
	{ id: 'e10', name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'hard', description: 'Bài tập toàn thân cường độ cao', instructions: 'Đứng thẳng, hạ người xuống tư thế squat. Đặt tay xuống sàn và nhảy chân ra sau (tư thế plank). Hít đất 1 lần. Nhảy chân về tư thế squat. Nhảy lên cao, giơ tay qua đầu. Lặp lại 10-15 lần x 3 hiệp.', caloriesPerHour: 700 },
	{ id: 'e11', name: 'Russian Twist', muscleGroup: 'Core', difficulty: 'medium', description: 'Xoay thân tập cơ bụng bên', instructions: 'Ngồi trên sàn, nghiêng thân ra sau 45 độ. Nâng chân lên khỏi sàn. Cầm tạ hoặc bóng, xoay thân sang trái rồi sang phải. Mỗi lần xoay là 1 lần. Lặp lại 20 lần x 3 hiệp.', caloriesPerHour: 350 },
	{ id: 'e12', name: 'Mountain Climber', muscleGroup: 'Full Body', difficulty: 'medium', description: 'Leo núi tại chỗ, cardio + core', instructions: 'Bắt đầu ở tư thế plank. Kéo đầu gối phải về phía ngực. Nhanh chóng đổi chân, đưa đầu gối trái về phía ngực. Tiếp tục đổi chân liên tục với tốc độ nhanh. Thực hiện 30 giây x 4 hiệp.', caloriesPerHour: 600 },
];

const initSeedData = () => {
	if (!localStorage.getItem('fitness_workouts')) {
		localStorage.setItem('fitness_workouts', JSON.stringify(SEED_WORKOUTS));
	}
	if (!localStorage.getItem('fitness_health')) {
		localStorage.setItem('fitness_health', JSON.stringify(SEED_HEALTH));
	}
	if (!localStorage.getItem('fitness_goals')) {
		localStorage.setItem('fitness_goals', JSON.stringify(SEED_GOALS));
	}
	if (!localStorage.getItem('fitness_exercises')) {
		localStorage.setItem('fitness_exercises', JSON.stringify(SEED_EXERCISES));
	}
};

export default () => {
	const [workouts, setWorkouts] = useState<Fitness.IWorkout[]>([]);
	const [healthMetrics, setHealthMetrics] = useState<Fitness.IHealthMetric[]>([]);
	const [goals, setGoals] = useState<Fitness.IGoal[]>([]);
	const [exercises, setExercises] = useState<Fitness.IExercise[]>([]);
	const [record, setRecord] = useState<any>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<string>('dashboard');

	const getDataWorkouts = () => {
		initSeedData();
		const data: Fitness.IWorkout[] = JSON.parse(localStorage.getItem('fitness_workouts') as string) || [];
		setWorkouts(data);
	};

	const getDataHealth = () => {
		initSeedData();
		const data: Fitness.IHealthMetric[] = JSON.parse(localStorage.getItem('fitness_health') as string) || [];
		setHealthMetrics(data);
	};

	const getDataGoals = () => {
		initSeedData();
		const data: Fitness.IGoal[] = JSON.parse(localStorage.getItem('fitness_goals') as string) || [];
		setGoals(data);
	};

	const getDataExercises = () => {
		initSeedData();
		const data: Fitness.IExercise[] = JSON.parse(localStorage.getItem('fitness_exercises') as string) || [];
		setExercises(data);
	};

	return {
		workouts, setWorkouts, getDataWorkouts,
		healthMetrics, setHealthMetrics, getDataHealth,
		goals, setGoals, getDataGoals,
		exercises, setExercises, getDataExercises,
		record, setRecord,
		isEdit, setIsEdit,
		visible, setVisible,
		visibleDrawer, setVisibleDrawer,
		activeTab, setActiveTab,
	};
};
