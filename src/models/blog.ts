import { useState } from 'react';


const SEED_TAGS: Blog.ITag[] = [
	{ id: 'tag-1', name: 'React', color: 'blue' },
	{ id: 'tag-2', name: 'TypeScript', color: 'cyan' },
	{ id: 'tag-3', name: 'CSS', color: 'magenta' },
	{ id: 'tag-4', name: 'JavaScript', color: 'gold' },
	{ id: 'tag-5', name: 'Node.js', color: 'green' },
	{ id: 'tag-6', name: 'UmiJS', color: 'purple' },
];

const SEED_POSTS: Blog.IPost[] = [
	{
		id: 'post-1',
		title: 'Bắt đầu với React và TypeScript',
		slug: 'bat-dau-voi-react-va-typescript',
		summary: 'Hướng dẫn chi tiết cách thiết lập dự án React với TypeScript, từ cài đặt đến cấu hình và viết component đầu tiên.',
		content: `# Bắt đầu với React và TypeScript

## Giới thiệu

React kết hợp TypeScript là một bộ đôi mạnh mẽ giúp xây dựng ứng dụng web hiện đại. TypeScript cung cấp kiểu tĩnh giúp phát hiện lỗi sớm và cải thiện trải nghiệm phát triển.

## Cài đặt

Sử dụng Create React App với template TypeScript:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Component đầu tiên

\`\`\`tsx
interface Props {
  name: string;
  age: number;
}

const Hello: React.FC<Props> = ({ name, age }) => {
  return <h1>Hello {name}, you are {age} years old!</h1>;
};
\`\`\`

## Hooks với TypeScript

### useState
\`\`\`tsx
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
\`\`\`

### useEffect
\`\`\`tsx
useEffect(() => {
  fetchData();
}, []);
\`\`\`

## Kết luận

React + TypeScript giúp code an toàn hơn, dễ bảo trì và refactor. Hãy bắt đầu sử dụng ngay hôm nay!`,
		coverImage: 'https://picsum.photos/seed/react-ts/800/400',
		author: 'Nguyễn Văn A',
		tags: ['tag-1', 'tag-2'],
		status: 'published',
		viewCount: 156,
		createdAt: '2026-04-01T08:00:00Z',
		updatedAt: '2026-04-01T08:00:00Z',
	},
	{
		id: 'post-2',
		title: 'CSS Grid Layout - Toàn tập',
		slug: 'css-grid-layout-toan-tap',
		summary: 'Tìm hiểu CSS Grid Layout từ cơ bản đến nâng cao. Xây dựng layout phức tạp một cách dễ dàng.',
		content: `# CSS Grid Layout - Toàn tập

## Grid là gì?

CSS Grid Layout là hệ thống layout hai chiều mạnh mẽ nhất trong CSS. Nó cho phép bạn tạo layout phức tạp mà không cần float hay positioning.

## Cú pháp cơ bản

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## Grid Template Areas

\`\`\`css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## Responsive Grid

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

## Kết luận

CSS Grid là công cụ không thể thiếu cho frontend developer hiện đại. Hãy thực hành nhiều để thành thạo!`,
		coverImage: 'https://picsum.photos/seed/css-grid/800/400',
		author: 'Nguyễn Văn A',
		tags: ['tag-3', 'tag-4'],
		status: 'published',
		viewCount: 89,
		createdAt: '2026-04-03T10:30:00Z',
		updatedAt: '2026-04-03T10:30:00Z',
	},
	{
		id: 'post-3',
		title: 'Xây dựng REST API với Node.js và Express',
		slug: 'xay-dung-rest-api-voi-nodejs-va-express',
		summary: 'Hướng dẫn từng bước xây dựng REST API hoàn chỉnh với Node.js, Express và MongoDB.',
		content: `# Xây dựng REST API với Node.js và Express

## Khởi tạo dự án

\`\`\`bash
mkdir my-api && cd my-api
npm init -y
npm install express mongoose dotenv
\`\`\`

## Cấu trúc thư mục

\`\`\`
src/
├── controllers/
├── models/
├── routes/
├── middleware/
└── index.js
\`\`\`

## Tạo Server

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## CRUD Operations

### Create
\`\`\`javascript
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});
\`\`\`

### Read
\`\`\`javascript
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
\`\`\`

## Kết luận

Node.js + Express là nền tảng tuyệt vời để xây dựng REST API nhanh chóng và hiệu quả.`,
		coverImage: 'https://picsum.photos/seed/nodejs-api/800/400',
		author: 'Trần Thị B',
		tags: ['tag-4', 'tag-5'],
		status: 'published',
		viewCount: 234,
		createdAt: '2026-04-05T14:00:00Z',
		updatedAt: '2026-04-05T14:00:00Z',
	},
	{
		id: 'post-4',
		title: 'UmiJS - Framework React chuyên nghiệp',
		slug: 'umijs-framework-react-chuyen-nghiep',
		summary: 'Khám phá UmiJS - enterprise-level React framework với routing, state management và nhiều plugin hữu ích.',
		content: `# UmiJS - Framework React chuyên nghiệp

## UmiJS là gì?

UmiJS là một framework React enterprise-level, được phát triển bởi Ant Group. Nó cung cấp sẵn routing, state management và nhiều tính năng hữu ích.

## Tính năng nổi bật

- **Convention-based Routing**: Tự động tạo route từ cấu trúc thư mục
- **Plugin System**: Hệ thống plugin mạnh mẽ và linh hoạt
- **Built-in State Management**: Tích hợp sẵn dva/model
- **TypeScript Support**: Hỗ trợ TypeScript native

## Cấu trúc dự án

\`\`\`
src/
├── pages/          # Các trang
├── models/         # State management
├── services/       # API calls
├── components/     # Shared components
└── utils/          # Utilities
\`\`\`

## Model Pattern

\`\`\`typescript
import { useState } from 'react';

export default () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const result = await fetchAPI();
    setData(result);
  };

  return { data, getData };
};
\`\`\`

## Sử dụng Model trong Component

\`\`\`tsx
import { useModel } from 'umi';

const MyComponent = () => {
  const { data, getData } = useModel('myModel');

  useEffect(() => {
    getData();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};
\`\`\`

## Kết luận

UmiJS là lựa chọn tuyệt vời cho các dự án React enterprise với đầy đủ tính năng out-of-the-box.`,
		coverImage: 'https://picsum.photos/seed/umijs/800/400',
		author: 'Nguyễn Văn A',
		tags: ['tag-1', 'tag-6'],
		status: 'published',
		viewCount: 67,
		createdAt: '2026-04-08T09:15:00Z',
		updatedAt: '2026-04-08T09:15:00Z',
	},
	{
		id: 'post-5',
		title: 'JavaScript ES2024 - Những tính năng mới',
		slug: 'javascript-es2024-nhung-tinh-nang-moi',
		summary: 'Cập nhật các tính năng mới nhất của JavaScript ES2024: Grouping, Temporal API, Pattern Matching và hơn thế nữa.',
		content: `# JavaScript ES2024 - Những tính năng mới

## Array Grouping

\`\`\`javascript
const people = [
  { name: 'An', age: 25 },
  { name: 'Bình', age: 30 },
  { name: 'Cường', age: 25 },
];

const grouped = Object.groupBy(people, p => p.age);
// { 25: [{...}, {...}], 30: [{...}] }
\`\`\`

## Promise.withResolvers()

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => resolve('Done!'), 1000);

const result = await promise; // 'Done!'
\`\`\`

## Temporal API

\`\`\`javascript
const now = Temporal.Now.plainDateTimeISO();
const future = now.add({ days: 7, hours: 3 });
console.log(future.toString());
\`\`\`

## Kết luận

JavaScript tiếp tục phát triển mạnh mẽ với nhiều tính năng hữu ích. Hãy cập nhật kiến thức thường xuyên!`,
		coverImage: 'https://picsum.photos/seed/es2024/800/400',
		author: 'Trần Thị B',
		tags: ['tag-4'],
		status: 'published',
		viewCount: 312,
		createdAt: '2026-04-10T16:45:00Z',
		updatedAt: '2026-04-10T16:45:00Z',
	},
	{
		id: 'post-6',
		title: 'Thiết kế Responsive với Flexbox',
		slug: 'thiet-ke-responsive-voi-flexbox',
		summary: 'Bài viết nháp về cách sử dụng Flexbox để tạo layout responsive, đang trong quá trình hoàn thiện.',
		content: `# Thiết kế Responsive với Flexbox

## Flexbox cơ bản

Flexbox là module layout một chiều, phù hợp cho việc sắp xếp các item theo hàng hoặc cột.

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
\`\`\`

## Responsive Navigation

\`\`\`css
.nav {
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
  }
}
\`\`\`

*Bài viết đang được hoàn thiện...*`,
		coverImage: 'https://picsum.photos/seed/flexbox/800/400',
		author: 'Nguyễn Văn A',
		tags: ['tag-3'],
		status: 'draft',
		viewCount: 0,
		createdAt: '2026-04-15T11:00:00Z',
		updatedAt: '2026-04-15T11:00:00Z',
	},
];

const initSeedData = () => {
	if (!localStorage.getItem('blog_tags')) {
		localStorage.setItem('blog_tags', JSON.stringify(SEED_TAGS));
	}
	if (!localStorage.getItem('blog_posts')) {
		localStorage.setItem('blog_posts', JSON.stringify(SEED_POSTS));
	}
};

export default () => {
	const [posts, setPosts] = useState<Blog.IPost[]>([]);
	const [tags, setTags] = useState<Blog.ITag[]>([]);
	const [record, setRecord] = useState<Blog.IPost>();
	const [recordTag, setRecordTag] = useState<Blog.ITag>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [visibleTag, setVisibleTag] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<string>('trang-chu');
	const [selectedPostId, setSelectedPostId] = useState<string>('');

	const getDataPosts = async () => {
		initSeedData();
		const dataLocal: Blog.IPost[] = JSON.parse(localStorage.getItem('blog_posts') as string) || [];
		setPosts(dataLocal);
	};

	const getDataTags = async () => {
		initSeedData();
		const dataLocal: Blog.ITag[] = JSON.parse(localStorage.getItem('blog_tags') as string) || [];
		setTags(dataLocal);
	};

	return {
		posts,
		setPosts,
		getDataPosts,
		tags,
		setTags,
		getDataTags,
		record,
		setRecord,
		recordTag,
		setRecordTag,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
		visibleTag,
		setVisibleTag,
		activeTab,
		setActiveTab,
		selectedPostId,
		setSelectedPostId,
	};
};
