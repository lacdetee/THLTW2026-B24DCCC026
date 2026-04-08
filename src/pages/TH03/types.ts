export type TrangThaiLich = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';

export interface KieuNhanVien { id: string; tenNhanVien: string; gioiHanKhach: number; caLamViec: string; }
export interface KieuDichVu { id: string; tenDichVu: string; giaTien: number; thoiGianThucHien: number; }
export interface KieuLichHen { id: string; tenKhachHang: string; ngayHen: string; gioHen: string; idNhanVien: string; idDichVu: string; trangThai: TrangThaiLich; }
export interface KieuDanhGia { id: string; idLichHen: string; idNhanVien: string; soSao: number; nhanXet: string; phanHoi: string; }