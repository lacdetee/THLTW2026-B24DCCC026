export interface KieuSoVanBang { id: string; nam: number; soVaoSoHienTai: number; }
export interface KieuQuyetDinh { id: string; soQuyetDinh: string; ngayBanHanh: string; trichYeu: string; idSoVanBang: string; luotTraCuu: number; }
export type KieuDuLieuTruong = 'String' | 'Number' | 'Date';
export interface KieuTruongThongTin { id: string; tenTruong: string; kieuDuLieu: KieuDuLieuTruong; }

export interface KieuVanBang {
  id: string;
  idQuyetDinh: string;
  soVaoSo: number;
  soHieu: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  thongTinDong: Record<string, any>; 
}