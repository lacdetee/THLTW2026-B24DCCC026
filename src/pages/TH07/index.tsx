import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { ChiTietBaiViet, GioiThieu, QuanLyBaiViet, QuanLyThe, TrangChu } from './components';

const { TabPane } = Tabs;

const BlogPage = () => {
	const { activeTab, setActiveTab, getDataPosts, getDataTags } = useModel('blog');

	useEffect(() => {
		getDataPosts();
		getDataTags();
	}, []);

	return (
		<Card bodyStyle={{ padding: '12px 24px' }}>
			<Tabs
				activeKey={activeTab}
				onChange={(key) => setActiveTab(key)}
				type='card'
				size='large'
			>
				<TabPane tab='Trang chủ' key='trang-chu'>
					<TrangChu />
				</TabPane>
				<TabPane tab='Chi tiết bài viết' key='chi-tiet' disabled={!true}>
					<ChiTietBaiViet />
				</TabPane>
				<TabPane tab='Giới thiệu' key='gioi-thieu'>
					<GioiThieu />
				</TabPane>
				<TabPane tab='Quản lý bài viết' key='quan-ly-bai-viet'>
					<QuanLyBaiViet />
				</TabPane>
				<TabPane tab='Quản lý thẻ' key='quan-ly-the'>
					<QuanLyThe />
				</TabPane>
			</Tabs>
		</Card>
	);
};

export default BlogPage;
