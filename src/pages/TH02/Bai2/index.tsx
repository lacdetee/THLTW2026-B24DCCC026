import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { KhKienThuc, MonHoc, CauHoi, CauTrucDe, DeThi } from './types';
import QuanLyDanhMuc from './components/QuanLyDanhMuc';
import QuanLyCauHoi from './components/QuanLyCauHoi';
import QuanLyDeThi from './components/QuanLyDeThi';

const { TabPane } = Tabs;

const Bai2_NganHangCauHoi: React.FC = () => {
	const [danhSachKhoi, datDanhSachKhoi] = useState<KhKienThuc[]>([]);
	const [danhSachMon, datDanhSachMon] = useState<MonHoc[]>([]);
	const [danhSachCauHoi, datDanhSachCauHoi] = useState<CauHoi[]>([]);
	const [danhSachCauTruc, datDanhSachCauTruc] = useState<CauTrucDe[]>([]);
	const [danhSachDeThi, datDanhSachDeThi] = useState<DeThi[]>([]);

	useEffect(() => {
		const dataKhoi = localStorage.getItem('DATA_KHOI');
		if (dataKhoi) datDanhSachKhoi(JSON.parse(dataKhoi));
		else
			datDanhSachKhoi([
				{ id: 'K1', tenKhoi: 'Tổng quan' },
				{ id: 'K2', tenKhoi: 'Chuyên sâu' },
			]);

		const dataMon = localStorage.getItem('DATA_MON_TH02');
		if (dataMon) datDanhSachMon(JSON.parse(dataMon));
		else datDanhSachMon([{ id: 'M1', maMon: 'INT123', tenMon: 'Lập trình Web', soTinChi: 3 }]);

		if (localStorage.getItem('DATA_CAU_HOI')) datDanhSachCauHoi(JSON.parse(localStorage.getItem('DATA_CAU_HOI')!));
		if (localStorage.getItem('DATA_CAU_TRUC')) datDanhSachCauTruc(JSON.parse(localStorage.getItem('DATA_CAU_TRUC')!));
		if (localStorage.getItem('DATA_DE_THI')) datDanhSachDeThi(JSON.parse(localStorage.getItem('DATA_DE_THI')!));
	}, []);

	const luuDuLieu = (key: string, data: any, setter: any) => {
		setter(data);
		localStorage.setItem(key, JSON.stringify(data));
	};

	return (
		<Card title='Bài 2: Hệ Thống Ngân Hàng Câu Hỏi & Sinh Đề Thi' style={{ margin: 24, borderRadius: 8 }}>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='1. Khối Kiến Thức & Môn Học' key='1'>
					<QuanLyDanhMuc
						danhSachKhoi={danhSachKhoi}
						danhSachMon={danhSachMon}
						luuDuLieu={luuDuLieu}
						datDanhSachMon={datDanhSachMon}
					/>
				</TabPane>

				<TabPane tab='2. Quản Lý Câu Hỏi' key='2'>
					<QuanLyCauHoi
						danhSachCauHoi={danhSachCauHoi}
						danhSachMon={danhSachMon}
						danhSachKhoi={danhSachKhoi}
						luuDuLieu={luuDuLieu}
						datDanhSachCauHoi={datDanhSachCauHoi}
					/>
				</TabPane>

				<TabPane tab='3. Sinh Đề Thi Tự Động' key='3'>
					<QuanLyDeThi
						danhSachCauHoi={danhSachCauHoi}
						danhSachMon={danhSachMon}
						danhSachKhoi={danhSachKhoi}
						danhSachCauTruc={danhSachCauTruc}
						danhSachDeThi={danhSachDeThi}
						luuDuLieu={luuDuLieu}
						datDanhSachCauTruc={datDanhSachCauTruc}
						datDanhSachDeThi={datDanhSachDeThi}
					/>
				</TabPane>
			</Tabs>
		</Card>
	);
};

export default Bai2_NganHangCauHoi;
