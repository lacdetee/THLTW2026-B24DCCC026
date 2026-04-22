import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Row, Tag, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const { Title, Text } = Typography;


const renderMarkdown = (md: string): string => {
	if (!md) return '';
	let html = md

		.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#f6f8fa;padding:16px;border-radius:8px;overflow-x:auto;font-size:14px;line-height:1.6;margin:16px 0"><code>$2</code></pre>')

		.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')

		.replace(/^### (.*$)/gm, '<h3 style="margin-top:24px;margin-bottom:12px">$1</h3>')
		.replace(/^## (.*$)/gm, '<h2 style="margin-top:32px;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #eee">$1</h2>')
		.replace(/^# (.*$)/gm, '<h1 style="margin-top:32px;margin-bottom:16px">$1</h1>')

		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

		.replace(/\*(.*?)\*/g, '<em>$1</em>')

		.replace(/^- (.*$)/gm, '<li style="margin-left:20px;margin-bottom:4px">$1</li>')

		.replace(/\n\n/g, '</p><p style="line-height:1.8;margin-bottom:16px">')

		.replace(/\n/g, '<br/>');

	return '<p style="line-height:1.8;margin-bottom:16px">' + html + '</p>';
};

const ChiTietBaiViet = () => {
	const { posts, tags, selectedPostId, setSelectedPostId, setActiveTab, getDataPosts } = useModel('blog');

	const post = useMemo(() => {
		return posts.find((p: Blog.IPost) => p.id === selectedPostId);
	}, [posts, selectedPostId]);


	useEffect(() => {
		if (selectedPostId && post) {
			const dataLocal: Blog.IPost[] = JSON.parse(localStorage.getItem('blog_posts') as string) || [];
			const updatedData = dataLocal.map((p) =>
				p.id === selectedPostId ? { ...p, viewCount: p.viewCount + 1 } : p,
			);
			localStorage.setItem('blog_posts', JSON.stringify(updatedData));
			getDataPosts();
		}
	}, [selectedPostId]);


	const relatedPosts = useMemo(() => {
		if (!post) return [];
		return posts
			.filter(
				(p: Blog.IPost) =>
					p.id !== post.id &&
					p.status === 'published' &&
					p.tags.some((tagId: string) => post.tags.includes(tagId)),
			)
			.slice(0, 3);
	}, [posts, post]);

	const getTagInfo = (tagId: string) => {
		return tags.find((t: Blog.ITag) => t.id === tagId);
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const handleViewRelated = (postId: string) => {
		setSelectedPostId(postId);
		window.scrollTo(0, 0);
	};

	if (!post) {
		return (
			<div style={{ textAlign: 'center', padding: 60 }}>
				<Empty description='Chưa chọn bài viết nào'>
					<Button type='primary' onClick={() => setActiveTab('trang-chu')}>
						Quay lại trang chủ
					</Button>
				</Empty>
			</div>
		);
	}

	return (
		<div style={{ maxWidth: 900, margin: '0 auto' }}>

			<Button
				type='link'
				icon={<ArrowLeftOutlined />}
				onClick={() => setActiveTab('trang-chu')}
				style={{ marginBottom: 16, paddingLeft: 0, fontSize: 16 }}
			>
				Quay lại danh sách
			</Button>


			<img
				src={post.coverImage}
				alt={post.title}
				style={{
					width: '100%',
					height: 350,
					objectFit: 'cover',
					borderRadius: 12,
					marginBottom: 24,
				}}
				onError={(e: any) => {
					e.target.src = 'https://via.placeholder.com/800x400?text=Blog+Post';
				}}
			/>


			<Title level={1} style={{ marginBottom: 16 }}>
				{post.title}
			</Title>


			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 24,
					marginBottom: 16,
					color: '#666',
					fontSize: 14,
					flexWrap: 'wrap',
				}}
			>
				<span>
					<UserOutlined style={{ marginRight: 6 }} />
					{post.author}
				</span>
				<span>
					<CalendarOutlined style={{ marginRight: 6 }} />
					{formatDate(post.createdAt)}
				</span>
				<span>
					<EyeOutlined style={{ marginRight: 6 }} />
					{post.viewCount} lượt xem
				</span>
			</div>


			<div style={{ marginBottom: 24 }}>
				{post.tags.map((tagId: string) => {
					const tag = getTagInfo(tagId);
					return tag ? (
						<Tag key={tagId} color={tag.color} style={{ fontSize: 13, padding: '2px 10px' }}>
							{tag.name}
						</Tag>
					) : null;
				})}
			</div>

			<Divider />


			<div
				style={{ fontSize: 16, lineHeight: 1.8 }}
				dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
			/>

			<Divider />


			{relatedPosts.length > 0 && (
				<div style={{ marginTop: 32 }}>
					<Title level={3}>📌 Bài viết liên quan</Title>
					<Row gutter={[16, 16]}>
						{relatedPosts.map((rPost: Blog.IPost) => (
							<Col xs={24} sm={8} key={rPost.id}>
								<Card
									hoverable
									onClick={() => handleViewRelated(rPost.id)}
									cover={
										<img
											alt={rPost.title}
											src={rPost.coverImage}
											style={{ height: 140, objectFit: 'cover' }}
											onError={(e: any) => {
												e.target.src = 'https://via.placeholder.com/400x200?text=Blog';
											}}
										/>
									}
									bodyStyle={{ padding: 12 }}
								>
									<Text strong ellipsis={{ tooltip: rPost.title }}>
										{rPost.title}
									</Text>
									<div style={{ marginTop: 8 }}>
										{rPost.tags.slice(0, 2).map((tagId: string) => {
											const tag = getTagInfo(tagId);
											return tag ? (
												<Tag key={tagId} color={tag.color} style={{ fontSize: 11 }}>
													{tag.name}
												</Tag>
											) : null;
										})}
									</div>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
};

export default ChiTietBaiViet;
