export interface monHoc {
  id: number;
  tenMon: string;
  thoiLuongMonHoc: number;
  noiDung: string;
}

export interface TienDoHocTap {
  id: number;
  tenMon: string;
  ngayHoc: string;
  thoiLuong: number;
  noiDung: string;
  ghiChu: string;
}

export interface MucTieu {
    id: number;
    tenMon: string;
    mucTieu: number;
    ghiChu: string;
    thoiLuongMonHoc: number;
    noiDung: string;
}

export const dataMonHoc: monHoc[] = [
  {
    id: 1,
    tenMon: "Toán",
    thoiLuongMonHoc: 45,
    noiDung: "Giải tích chương 1",
  },
  {
    id: 2,
    tenMon: "Văn",
    thoiLuongMonHoc: 60,
    noiDung: "Phân tích tác phẩm",
  },
  {
    id: 3,
    tenMon: "Lập trình Web",
    thoiLuongMonHoc: 90,
    noiDung: "React + TypeScript",
  },
];

export const dataTienDoHocTap: TienDoHocTap[] = [
  {
    id:1,
    tenMon: "Toán",
    ngayHoc: "2026-03-01",
    thoiLuong: 2,
    noiDung: "Ôn tập giới hạn",
    ghiChu: "Làm thêm bài tập cuối chương",
  },
  {
    id:2,
    tenMon: "Văn",
    ngayHoc: "2026-03-02",
    thoiLuong: 1.5,
    noiDung: "Phân tích tác phẩm",
    ghiChu: "Chuẩn bị bài thuyết trình",
  },
  {
    id:3,
    tenMon: "Lập trình Web",
    ngayHoc: "2026-03-04",
    thoiLuong: 3,
    noiDung: "React Hooks",
    ghiChu: "Thực hành useEffect",
  },
  {
    id:4,
    tenMon: "Toán",
    ngayHoc: "2026-03-05",
    thoiLuong: 1,
    noiDung: "Đạo hàm",
    ghiChu: "Ôn lại quy tắc chuỗi",
  },
];

export const dataMucTieu: MucTieu[] = [
  {
    id: 1,
    tenMon: "Toán",
    mucTieu: 20, 
    ghiChu: "Tập trung vào Giải tích 2",
    thoiLuongMonHoc: 45,
    noiDung: "Giới hạn, đạo hàm, tích phân",
  },
  {
    id: 2,
    tenMon: "Lập trình Web",
    mucTieu: 30,
    ghiChu: "Hoàn thành project React",
    thoiLuongMonHoc: 90,
    noiDung: "React + TypeScript + Ant Design",
  },
  {
    id: 3,
    tenMon: "Tiếng Anh",
    mucTieu: 15,
    ghiChu: "Ôn IELTS Listening",
    thoiLuongMonHoc: 60,
    noiDung: "Practice test + review từ vựng",
  },
];