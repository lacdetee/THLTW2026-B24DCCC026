import { CalendarOutlined, EyeOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Input, Pagination, Row, Tag, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModel } from 'umi';

const { Meta } = Card;
const { Paragraph, Text, Title } = Typography;

const PAGE_SIZE = 9;

const TrangChu = () => {
	const { posts, tags, setActiveTab, setSelectedPostId } = useModel('blog');

	const [searchText, setSearchText] = useState<string>('');
	const [debouncedSearch, setDebouncedSearch] = useState<string>('');
	const [selectedTag, setSelectedTag] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const timerRef = useRef<any>(null);


	const handleSearch = useCallback((value: string) => {
		setSearchText(value);
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			setDebouncedSearch(value);
			setCurrentPage(1);
		}, 300);
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);


	const publishedPosts = useMemo(() => {
		return posts.filter((p: Blog.IPost) => p.status === 'published');
	}, [posts]);


	const filteredPosts = useMemo(() => {
		return publishedPosts.filter((post: Blog.IPost) => {
			const matchSearch =
				!debouncedSearch ||
				post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
				post.summary.toLowerCase().includes(debouncedSearch.toLowerCase());
			const matchTag = !selectedTag || post.tags.includes(selectedTag);
			return matchSearch && matchTag;
		});
	}, [publishedPosts, debouncedSearch, selectedTag]);


	const paginatedPosts = useMemo(() => {
		const start = (currentPage - 1) * PAGE_SIZE;
		return filteredPosts.slice(start, start + PAGE_SIZE);
	}, [filteredPosts, currentPage]);

	const getTagName = (tagId: string) => {
		const tag = tags.find((t: Blog.ITag) => t.id === tagId);
		return tag;
	};

	const handleViewPost = (postId: string) => {
		setSelectedPostId(postId);
		setActiveTab('chi-tiet');
	};

	const handleTagFilter = (tagId: string) => {
		if (selectedTag === tagId) {
			setSelectedTag('');
		} else {
			setSelectedTag(tagId);
		}
		setCurrentPage(1);
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div>

			<div style={{ textAlign: 'center', marginBottom: 32 }}>
				<Title level={2} style={{ marginBottom: 8 }}>
					📝 Blog Cá Nhân
				</Title>
				<Paragraph type='secondary' style={{ fontSize: 16 }}>
					Chia sẻ kiến thức lập trình và công nghệ
				</Paragraph>
			</div>


			<div style={{ marginBottom: 24 }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} md={12}>
						<Input
							placeholder='Tìm kiếm bài viết...'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => handleSearch(e.target.value)}
							allowClear
							size='large'
						/>
					</Col>
					<Col xs={24} md={12}>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
							<Text strong>Lọc theo thẻ:</Text>
							{tags.map((tag: Blog.ITag) => (
								<Tag
									key={tag.id}
									color={selectedTag === tag.id ? tag.color : undefined}
									onClick={() => handleTagFilter(tag.id)}
									style={{
										cursor: 'pointer',
										border: selectedTag === tag.id ? `2px solid` : '1px solid #d9d9d9',
										fontWeight: selectedTag === tag.id ? 'bold' : 'normal',
									}}
								>
									{tag.name}
								</Tag>
							))}
							{selectedTag && (
								<Tag
									closable
									onClose={() => {
										setSelectedTag('');
										setCurrentPage(1);
									}}
									color='red'
								>
									Xóa lọc
								</Tag>
							)}
						</div>
					</Col>
				</Row>
			</div>


			{paginatedPosts.length === 0 ? (
				<Empty description='Không tìm thấy bài viết nào' style={{ padding: 60 }} />
			) : (
				<Row gutter={[24, 24]}>
					{paginatedPosts.map((post: Blog.IPost) => (
						<Col xs={24} sm={12} lg={8} key={post.id}>
							<Card
								hoverable
								onClick={() => handleViewPost(post.id)}
								cover={
									<img
										alt={post.title}
										src={post.coverImage}
										style={{ height: 200, objectFit: 'cover' }}
										onError={(e: any) => {
											e.target.src = 'https://via.placeholder.com/800x400?text=Blog+Post';
										}}
									/>
								}
								bodyStyle={{ padding: 16 }}
							>
								<Meta
									title={
										<Text
											strong
											style={{ fontSize: 16 }}
											ellipsis={{ tooltip: post.title }}
										>
											{post.title}
										</Text>
									}
									description={
										<div>
											<Paragraph
												type='secondary'
												ellipsis={{ rows: 2 }}
												style={{ marginBottom: 12, minHeight: 44 }}
											>
												{post.summary}
											</Paragraph>

											<div style={{ marginBottom: 8 }}>
												{post.tags.map((tagId: string) => {
													const tag = getTagName(tagId);
													return tag ? (
														<Tag
															key={tagId}
															color={tag.color}
															style={{ marginBottom: 4 }}
															onClick={(e) => {
																e.stopPropagation();
																handleTagFilter(tag.id);
															}}
														>
															{tag.name}
														</Tag>
													) : null;
												})}
											</div>

											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													fontSize: 12,
													color: '#999',
												}}
											>
												<span>
													<UserOutlined style={{ marginRight: 4 }} />
													{post.author}
												</span>
												<span>
													<CalendarOutlined style={{ marginRight: 4 }} />
													{formatDate(post.createdAt)}
												</span>
												<span>
													<EyeOutlined style={{ marginRight: 4 }} />
													{post.viewCount}
												</span>
											</div>
										</div>
									}
								/>
							</Card>
						</Col>
					))}
				</Row>
			)}


			{filteredPosts.length > PAGE_SIZE && (
				<div style={{ textAlign: 'center', marginTop: 32 }}>
					<Pagination
						current={currentPage}
						pageSize={PAGE_SIZE}
						total={filteredPosts.length}
						onChange={(page) => setCurrentPage(page)}
						showTotal={(total) => `Tổng ${total} bài viết`}
					/>
				</div>
			)}
		</div>
	);
};

export default TrangChu;
