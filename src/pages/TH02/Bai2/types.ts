export type MucDo = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface KhKienThuc {
	id: string;
	tenKhoi: string;
}
export interface MonHoc {
	id: string;
	maMon: string;
	tenMon: string;
	soTinChi: number;
}
export interface CauHoi {
	id: string;
	idMon: string;
	idKhoi: string;
	noiDung: string;
	mucDo: MucDo;
}

export interface TieuChiDe {
	idKhoi: string;
	mucDo: MucDo;
	soLuong: number;
}
export interface CauTrucDe {
	id: string;
	tenCauTruc: string;
	idMon: string;
	danhSachTieuChi: TieuChiDe[];
}
export interface DeThi {
	id: string;
	tenDeThi: string;
	idCauTruc: string;
	danhSachCauHoi: CauHoi[];
	ngayTao: string;
}
