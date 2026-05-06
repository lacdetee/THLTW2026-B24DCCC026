declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'react-split-pane/lib/Pane';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare const APP_CONFIG_IP_ROOT: string;
declare const APP_CONFIG_ONE_SIGNAL_ID: string;
declare const APP_CONFIG_SENTRY_DSN: string;
declare const APP_CONFIG_KEYCLOAK_AUTHORITY: string;
declare const APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID: string;
declare const APP_CONFIG_APP_VERSION: string;

declare const APP_CONFIG_CO_QUAN_CHU_QUAN: string;
declare const APP_CONFIG_TEN_TRUONG: string;
declare const APP_CONFIG_TIEN_TO_TRUONG: string;
declare const APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH: string;
declare const APP_CONFIG_PRIMARY_COLOR: string;

declare const APP_CONFIG_URL_LANDING: string;
declare const APP_CONFIG_URL_CONNECT: string;
declare const APP_CONFIG_URL_CAN_BO: string;
declare const APP_CONFIG_URL_DAO_TAO: string;
declare const APP_CONFIG_URL_NHAN_SU: string;
declare const APP_CONFIG_URL_TAI_CHINH: string;
declare const APP_CONFIG_URL_CTSV: string;
declare const APP_CONFIG_URL_QLKH: string;
declare const APP_CONFIG_URL_VPS: string;
declare const APP_CONFIG_URL_KHAO_THI: string;
declare const APP_CONFIG_URL_CORE: string;
declare const APP_CONFIG_URL_CSVC: string;
declare const APP_CONFIG_URL_THU_VIEN: string;
declare const APP_CONFIG_URL_QLVB: string;

declare const APP_CONFIG_TITLE_LANDING: string;
declare const APP_CONFIG_TITLE_CONNECT: string;
declare const APP_CONFIG_TITLE_CAN_BO: string;
declare const APP_CONFIG_TITLE_DAO_TAO: string;
declare const APP_CONFIG_TITLE_NHAN_SU: string;
declare const APP_CONFIG_TITLE_TAI_CHINH: string;
declare const APP_CONFIG_TITLE_CTSV: string;
declare const APP_CONFIG_TITLE_QLKH: string;
declare const APP_CONFIG_TITLE_VPS: string;
declare const APP_CONFIG_TITLE_KHAO_THI: string;
declare const APP_CONFIG_TITLE_CORE: string;
declare const APP_CONFIG_TITLE_CSVC: string;
declare const APP_CONFIG_TITLE_THU_VIEN: string;
declare const APP_CONFIG_TITLE_QLVB: string;

declare namespace PhongHoc {
	interface IRecord {
		maPhong: string;
		tenPhong: string;
		soChoNgoi: number;
		loaiPhong: 'ly_thuyet' | 'thuc_hanh' | 'hoi_truong';
		nguoiPhuTrach: string;
	}
}

declare namespace Blog {
	interface ITag {
		id: string;
		name: string;
		color: string;
	}

	interface IPost {
		id: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		coverImage: string;
		author: string;
		tags: string[];
		status: 'draft' | 'published';
		viewCount: number;
		createdAt: string;
		updatedAt: string;
	}
}

declare namespace Fitness {
	type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
	type WorkoutStatus = 'completed' | 'missed';
	type GoalType = 'weight_loss' | 'muscle_gain' | 'endurance' | 'other';
	type GoalStatus = 'in_progress' | 'achieved' | 'cancelled';
	type Difficulty = 'easy' | 'medium' | 'hard';
	type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';

	interface IWorkout {
		id: string;
		date: string;
		type: WorkoutType;
		duration: number;
		calories: number;
		note: string;
		status: WorkoutStatus;
	}

	interface IHealthMetric {
		id: string;
		date: string;
		weight: number;
		height: number;
		bmi: number;
		heartRate: number;
		sleepHours: number;
	}

	interface IGoal {
		id: string;
		name: string;
		type: GoalType;
		targetValue: number;
		currentValue: number;
		deadline: string;
		status: GoalStatus;
		unit: string;
	}

	interface IExercise {
		id: string;
		name: string;
		muscleGroup: MuscleGroup;
		difficulty: Difficulty;
		description: string;
		instructions: string;
		caloriesPerHour: number;
	}
}

declare namespace Kanban {
	type TaskStatus = 'todo' | 'in_progress' | 'done';
	type Priority = 'high' | 'medium' | 'low';

	interface ITask {
		id: string;
		name: string;
		description: string;
		deadline: string;
		priority: Priority;
		status: TaskStatus;
		tag: string;
		createdAt: string;
	}
}
