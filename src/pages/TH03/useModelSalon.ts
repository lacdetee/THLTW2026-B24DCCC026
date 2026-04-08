import { useState, useEffect } from 'react';
import { message } from 'antd';
import { KieuNhanVien, KieuDichVu, KieuLichHen, KieuDanhGia } from '../pages/TH03/types';

export default function useModelSalon() {
  const [danhSachNhanVien, datDanhSachNhanVien] = useState<KieuNhanVien[]>([]);
  const [danhSachDichVu, datDanhSachDichVu] = useState<KieuDichVu[]>([]);
  const [danhSachLichHen, datDanhSachLichHen] = useState<KieuLichHen[]>([]);
  const [danhSachDanhGia, datDanhSachDanhGia] = useState<KieuDanhGia[]>([]);

  useEffect(() => {
    const nv = localStorage.getItem('TH03_NHAN_VIEN');
    const dv = localStorage.getItem('TH03_DICH_VU');
    const lh = localStorage.getItem('TH03_LICH_HEN');
    const dg = localStorage.getItem('TH03_DANH_GIA');

    if (nv) datDanhSachNhanVien(JSON.parse(nv));
    else luuNhanVien([{ id: 'NV1', tenNhanVien: 'Nguyễn Văn A', gioiHanKhach: 5, caLamViec: '08:00-17:00' }]);

    if (dv) datDanhSachDichVu(JSON.parse(dv));
    else luuDichVu([{ id: 'DV1', tenDichVu: 'Cắt tóc nam', giaTien: 50000, thoiGianThucHien: 30 }]);

    if (lh) datDanhSachLichHen(JSON.parse(lh));
    if (dg) datDanhSachDanhGia(JSON.parse(dg));
  }, []);

  const luuNhanVien = (data: KieuNhanVien[]) => { datDanhSachNhanVien(data); localStorage.setItem('TH03_NHAN_VIEN', JSON.stringify(data)); };
  const luuDichVu = (data: KieuDichVu[]) => { datDanhSachDichVu(data); localStorage.setItem('TH03_DICH_VU', JSON.stringify(data)); };
  const luuLichHen = (data: KieuLichHen[]) => { datDanhSachLichHen(data); localStorage.setItem('TH03_LICH_HEN', JSON.stringify(data)); };
  const luuDanhGia = (data: KieuDanhGia[]) => { datDanhSachDanhGia(data); localStorage.setItem('TH03_DANH_GIA', JSON.stringify(data)); };

  // --- LOGIC: KIỂM TRA & ĐẶT LỊCH ---
  const themLichHenMoi = (lichMoi: KieuLichHen) => {
    const nhanVien = danhSachNhanVien.find(nv => nv.id === lichMoi.idNhanVien);
    if (!nhanVien) return false;

    // 1. Kiểm tra giới hạn khách trong ngày
    const soKhachTrongNgay = danhSachLichHen.filter(lh => lh.idNhanVien === lichMoi.idNhanVien && lh.ngayHen === lichMoi.ngayHen && lh.trangThai !== 'Hủy').length;
    if (soKhachTrongNgay >= nhanVien.gioiHanKhach) {
      message.error(`Nhân viên ${nhanVien.tenNhanVien} đã kín lịch (${nhanVien.gioiHanKhach} khách) ngày ${lichMoi.ngayHen}!`);
      return false;
    }

    // 2. Kiểm tra trùng khung giờ
    const biTrungGio = danhSachLichHen.some(lh => lh.idNhanVien === lichMoi.idNhanVien && lh.ngayHen === lichMoi.ngayHen && lh.gioHen === lichMoi.gioHen && lh.trangThai !== 'Hủy');
    if (biTrungGio) {
      message.error(`Nhân viên đã có lịch lúc ${lichMoi.gioHen}. Vui lòng chọn giờ khác!`);
      return false;
    }

    luuLichHen([...danhSachLichHen, { ...lichMoi, id: `LH_${Date.now()}`, trangThai: 'Chờ duyệt' }]);
    message.success('Đặt lịch thành công!');
    return true;
  };

  return { danhSachNhanVien, luuNhanVien, danhSachDichVu, luuDichVu, danhSachLichHen, luuLichHen, themLichHenMoi, danhSachDanhGia, luuDanhGia };
}