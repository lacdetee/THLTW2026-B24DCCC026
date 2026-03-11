import React, { useState } from 'react';
import { Card, Button, Typography, Space, Row, Col, List, Tag } from 'antd';

const { Title, Text } = Typography;

type LuaChon = 'Kéo' | 'Búa' | 'Bao';

interface VanDau {
	lanDau: number;
	nguoi: LuaChon;
	may: LuaChon;
	ketQua: 'Thắng' | 'Thua' | 'Hòa';
}

const danhSachLuaChon: LuaChon[] = ['Kéo', 'Búa', 'Bao'];

const Bai1_OanTuTi: React.FC = () => {
	const [lichSu, datLichSu] = useState<VanDau[]>([]);

	const xuLyChon = (chonCuaNguoi: LuaChon) => {
		const chonCuaMay = danhSachLuaChon[Math.floor(Math.random() * danhSachLuaChon.length)];
		let ketQua: 'Thắng' | 'Thua' | 'Hòa' = 'Hòa';

		if (chonCuaNguoi === chonCuaMay) {
			ketQua = 'Hòa';
		} else if (
			(chonCuaNguoi === 'Kéo' && chonCuaMay === 'Bao') ||
			(chonCuaNguoi === 'Búa' && chonCuaMay === 'Kéo') ||
			(chonCuaNguoi === 'Bao' && chonCuaMay === 'Búa')
		) {
			ketQua = 'Thắng';
		} else {
			ketQua = 'Thua';
		}

		const vanMoi: VanDau = {
			lanDau: lichSu.length + 1,
			nguoi: chonCuaNguoi,
			may: chonCuaMay,
			ketQua: ketQua,
		};

		datLichSu([vanMoi, ...lichSu]);
	};

	const layMauKetQua = (kq: string) => {
		if (kq === 'Thắng') return 'success';
		if (kq === 'Thua') return 'error';
		return 'warning';
	};

	return (
		<Card title='Bài 1: Trò Chơi Oẳn Tù Tì' style={{ margin: 24, borderRadius: 8 }}>
			<Row gutter={24}>
				<Col span={12} style={{ textAlign: 'center' }}>
					<Title level={4}>Lượt đi của bạn</Title>
					<Space size='large' style={{ marginTop: 20 }}>
						<Button size='large' type='primary' onClick={() => xuLyChon('Kéo')}>
							Kéo
						</Button>
						<Button
							size='large'
							type='primary'
							onClick={() => xuLyChon('Búa')}
							style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
						>
							Búa
						</Button>
						<Button
							size='large'
							type='primary'
							onClick={() => xuLyChon('Bao')}
							style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
						>
							Bao
						</Button>
					</Space>

					{lichSu.length > 0 && (
						<div style={{ marginTop: 40 }}>
							<Title level={5}>Ván gần nhất</Title>
							<Text style={{ fontSize: 18 }}>
								Bạn chọn <Text strong>{lichSu[0].nguoi}</Text> 🆚 Máy chọn <Text strong>{lichSu[0].may}</Text>
							</Text>
							<br />
							<br />
							<Tag color={layMauKetQua(lichSu[0].ketQua)} style={{ fontSize: 20, padding: '10px 20px' }}>
								{lichSu[0].ketQua.toUpperCase()}
							</Tag>
						</div>
					)}
				</Col>

				<Col span={12}>
					<Title level={4}>Lịch sử thi đấu</Title>
					<List
						size='small'
						bordered
						dataSource={lichSu}
						style={{ maxHeight: 300, overflowY: 'auto' }}
						renderItem={(item) => (
							<List.Item>
								<Text>
									Ván {item.lanDau}: Bạn (<Text strong>{item.nguoi}</Text>) - Máy (<Text strong>{item.may}</Text>) ➡️{' '}
									<Tag color={layMauKetQua(item.ketQua)}>{item.ketQua}</Tag>
								</Text>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default Bai1_OanTuTi;
