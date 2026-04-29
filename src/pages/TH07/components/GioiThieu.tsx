import {
	FacebookOutlined,
	GithubOutlined,
	LinkedinOutlined,
	MailOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Progress, Row, Space, Tag, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const SKILLS = [
	{ name: 'React', level: 90, color: '#61dafb' },
	{ name: 'TypeScript', level: 85, color: '#3178c6' },
	{ name: 'JavaScript', level: 95, color: '#f7df1e' },
	{ name: 'Node.js', level: 80, color: '#339933' },
	{ name: 'CSS / SCSS', level: 85, color: '#cc6699' },
	{ name: 'UmiJS', level: 75, color: '#1890ff' },
	{ name: 'Ant Design', level: 90, color: '#1890ff' },
	{ name: 'Git', level: 85, color: '#f05032' },
];

const SOCIAL_LINKS = [
	{ icon: <GithubOutlined />, label: 'GitHub', url: 'https://github.com', color: '#333' },
	{ icon: <FacebookOutlined />, label: 'Facebook', url: 'https://facebook.com', color: '#1877f2' },
	{ icon: <LinkedinOutlined />, label: 'LinkedIn', url: 'https://linkedin.com', color: '#0a66c2' },
	{ icon: <MailOutlined />, label: 'Email', url: 'mailto:contact@blog.com', color: '#ea4335' },
];

const GioiThieu = () => {
	return (
		<div style={{ maxWidth: 900, margin: '0 auto' }}>

			<Card
				style={{
					textAlign: 'center',
					borderRadius: 16,
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
					marginBottom: 32,
				}}
				bodyStyle={{ padding: '40px 24px' }}
			>
				<Avatar
					size={120}
					src='https://picsum.photos/seed/avatar/200/200'
					style={{
						border: '4px solid white',
						boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
						marginBottom: 16,
					}}
				/>
				<Title level={2} style={{ color: 'white', marginBottom: 4 }}>
					Thân Đức Anh
				</Title>
				<Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
					Full-stack Developer | Blogger
				</Text>
				<Paragraph
					style={{
						color: 'rgba(255,255,255,0.9)',
						maxWidth: 600,
						margin: '16px auto 0',
						fontSize: 15,
					}}
				>
					Xin chào! Tôi là một lập trình viên full-stack với hơn 3 năm kinh nghiệm trong phát triển
					web. Tôi đam mê chia sẻ kiến thức về lập trình, đặc biệt là React, TypeScript và các
					công nghệ web hiện đại. Blog này là nơi tôi ghi lại những kiến thức, kinh nghiệm và bài
					học trong hành trình lập trình của mình.
				</Paragraph>


				<Space size='middle' style={{ marginTop: 24 }}>
					{SOCIAL_LINKS.map((link) => (
						<Button
							key={link.label}
							type='primary'
							shape='circle'
							size='large'
							icon={link.icon}
							style={{
								background: 'rgba(255,255,255,0.2)',
								border: 'none',
							}}
							onClick={() => window.open(link.url, '_blank')}
						/>
					))}
				</Space>
			</Card>


			<Card
				title={<Title level={3} style={{ margin: 0 }}>💻 Kỹ năng chuyên môn</Title>}
				style={{ borderRadius: 12, marginBottom: 32 }}
			>
				<Row gutter={[32, 20]}>
					{SKILLS.map((skill) => (
						<Col xs={24} sm={12} key={skill.name}>
							<div style={{ marginBottom: 4 }}>
								<Text strong>{skill.name}</Text>
								<Text type='secondary' style={{ float: 'right' }}>
									{skill.level}%
								</Text>
							</div>
							<Progress
								percent={skill.level}
								showInfo={false}
								strokeColor={skill.color}
								trailColor='#f0f0f0'
								strokeWidth={10}
								style={{ marginBottom: 0 }}
							/>
						</Col>
					))}
				</Row>
			</Card>


			<Row gutter={[24, 24]}>
				<Col xs={24} sm={12}>
					<Card
						title={<Title level={4} style={{ margin: 0 }}>🎓 Học vấn</Title>}
						style={{ borderRadius: 12, height: '100%' }}
					>
						<Paragraph>
							<Text strong>Đại học Bách Khoa</Text>
							<br />
							<Text type='secondary'>Cử nhân Công nghệ Thông tin</Text>
							<br />
							<Text type='secondary'>2020 - 2024</Text>
						</Paragraph>
						<Divider style={{ margin: '12px 0' }} />
						<Paragraph style={{ marginBottom: 0 }}>
							<Text strong>Chứng chỉ</Text>
							<br />
							<Tag color='blue'>AWS Certified</Tag>
							<Tag color='green'>React Advanced</Tag>
							<Tag color='purple'>TypeScript Pro</Tag>
						</Paragraph>
					</Card>
				</Col>
				<Col xs={24} sm={12}>
					<Card
						title={<Title level={4} style={{ margin: 0 }}>📫 Liên hệ</Title>}
						style={{ borderRadius: 12, height: '100%' }}
					>
						{SOCIAL_LINKS.map((link) => (
							<div key={link.label} style={{ marginBottom: 12 }}>
								<Button
									type='link'
									icon={link.icon}
									onClick={() => window.open(link.url, '_blank')}
									style={{ padding: 0, color: link.color }}
								>
									<span style={{ marginLeft: 8 }}>{link.label}</span>
								</Button>
							</div>
						))}
						<Divider style={{ margin: '12px 0' }} />
						<Paragraph type='secondary' style={{ marginBottom: 0 }}>
							Sẵn sàng hợp tác và trao đổi kiến thức. Hãy liên hệ với tôi qua các kênh trên!
						</Paragraph>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default GioiThieu;
