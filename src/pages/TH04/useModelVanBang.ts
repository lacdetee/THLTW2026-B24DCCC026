    import { useState, useEffect } from 'react';
import { message } from 'antd';
import { KieuSoVanBang, KieuQuyetDinh, KieuTruongThongTin, KieuVanBang } from '../pages/TH04/types';
import { KHOA_LUU_TRU_TH04 } from '../pages/TH04/constants';

export default function useModelVanBang() {
  const [danhSachSo, datDanhSachSo] = useState<KieuSoVanBang[]>([]);
  const [danhSachQuyetDinh, datDanhSachQuyetDinh] = useState<KieuQuyetDinh[]>([]);
  const [danhSachTruong, datDanhSachTruong] = useState<KieuTruongThongTin[]>([]);
  const [danhSachVanBang, datDanhSachVanBang] = useState<KieuVanBang[]>([]);

  useEffect(() => {
    const sb = localStorage.getItem(KHOA_LUU_TRU_TH04.SO_VAN_BANG);
    const qd = localStorage.getItem(KHOA_LUU_TRU_TH04.QUYET_DINH);
    const ch = localStorage.getItem(KHOA_LUU_TRU_TH04.CAU_HINH);
    const vb = localStorage.getItem(KHOA_LUU_TRU_TH04.VAN_BANG);

    if (sb) datDanhSachSo(JSON.parse(sb));
    else luuSoVanBang([{ id: 'SO_2026', nam: 2026, soVaoSoHienTai: 0 }]);

    if (qd) datDanhSachQuyetDinh(JSON.parse(qd));
    if (ch) datDanhSachTruong(JSON.parse(ch));
    else luuTruongThongTin([
      { id: 'T1', tenTruong: 'Dân tộc', kieuDuLieu: 'String' },
      { id: 'T2', tenTruong: 'Điểm trung bình', kieuDuLieu: 'Number' }
    ]);

    if (vb) datDanhSachVanBang(JSON.parse(vb));
  }, []);

  const luuSoVanBang = (data: KieuSoVanBang[]) => { datDanhSachSo(data); localStorage.setItem(KHOA_LUU_TRU_TH04.SO_VAN_BANG, JSON.stringify(data)); };
  const luuQuyetDinh = (data: KieuQuyetDinh[]) => { datDanhSachQuyetDinh(data); localStorage.setItem(KHOA_LUU_TRU_TH04.QUYET_DINH, JSON.stringify(data)); };
  const luuTruongThongTin = (data: KieuTruongThongTin[]) => { datDanhSachTruong(data); localStorage.setItem(KHOA_LUU_TRU_TH04.CAU_HINH, JSON.stringify(data)); };
  const luuVanBang = (data: KieuVanBang[]) => { datDanhSachVanBang(data); localStorage.setItem(KHOA_LUU_TRU_TH04.VAN_BANG, JSON.stringify(data)); };

  const capPhatVanBang = (vanBangMoi: Omit<KieuVanBang, 'soVaoSo' | 'id'>) => {
    const quyetDinh = danhSachQuyetDinh.find(qd => qd.id === vanBangMoi.idQuyetDinh);
    if (!quyetDinh) return message.error('Không tìm thấy quyết định!');

    const soVanBang = danhSachSo.find(s => s.id === quyetDinh.idSoVanBang);
    if (!soVanBang) return message.error('Không tìm thấy sổ văn bằng tương ứng!');

    const soVaoSoMoi = soVanBang.soVaoSoHienTai + 1;
    
    luuSoVanBang(danhSachSo.map(s => s.id === soVanBang.id ? { ...s, soVaoSoHienTai: soVaoSoMoi } : s));
    
    const vbLuu: KieuVanBang = { ...vanBangMoi, id: `VB_${Date.now()}`, soVaoSo: soVaoSoMoi };
    luuVanBang([...danhSachVanBang, vbLuu]);
    message.success('Cấp phát văn bằng thành công!');
    return true;
  };

  const tangLuotTraCuu = (idQuyetDinh: string) => {
    luuQuyetDinh(danhSachQuyetDinh.map(qd => qd.id === idQuyetDinh ? { ...qd, luotTraCuu: qd.luotTraCuu + 1 } : qd));
  };

  return { 
    danhSachSo, luuSoVanBang, 
    danhSachQuyetDinh, luuQuyetDinh, 
    danhSachTruong, luuTruongThongTin, 
    danhSachVanBang, luuVanBang, capPhatVanBang, tangLuotTraCuu 
  };
}