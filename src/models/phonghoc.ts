import { useState } from 'react';

export default () => {
	const [data, setData] = useState<PhongHoc.IRecord[]>([]);
	const [record, setRecord] = useState<PhongHoc.IRecord>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);

	const getDataPhongHoc = async () => {
		const dataLocal: PhongHoc.IRecord[] =
			JSON.parse(localStorage.getItem('phonghoc') as string) || [];
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataPhongHoc,
		record,
		setRecord,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
	};
};
