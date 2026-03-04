import { Button, Table, Tabs, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import { dataMonHoc, dataMucTieu, dataTienDoHocTap } from './Data';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
const Bai2 = () => {
    const [monHocList, setMonHocList] = useState(dataMonHoc);
    const [tienDoList, setTienDoList] = useState(dataTienDoHocTap);
    const [mucTieuList, setMucTieuList] = useState(dataMucTieu);

    const [isTienDoModalOpen, setIsTienDoModalOpen] = useState(false);
    const [editingTienDo, setEditingTienDo] = useState<any>(null);
    const [tienDoForm] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMonHoc, setEditingMonHoc] = useState<any>(null);
    const [form] = Form.useForm();

    const [isMucTieuModalOpen, setIsMucTieuModalOpen] = useState(false);
    const [editingMucTieu, setEditingMucTieu] = useState<any>(null);
    const [mucTieuForm] = Form.useForm();

    const handleAddMonHoc = () => {
        setEditingMonHoc(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditMonHoc = (record: any) => {
        setEditingMonHoc(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingMonHoc) {
                const updated = monHocList.map(item =>
                    item.id === editingMonHoc.id ? { ...item, ...values } : item
                );
                setMonHocList(updated);
            } else {
                const newMon = {
                    id: monHocList.length ? monHocList[monHocList.length - 1].id + 1 : 1,
                    ...values
                };
                setMonHocList([...monHocList, newMon]);
            }

            setIsModalOpen(false);
        });
    };

    useEffect(() => {
        const savedMonHoc = localStorage.getItem("monHoc");
        const savedTienDo = localStorage.getItem("tienDo");
        const savedMucTieu = localStorage.getItem("mucTieu");

        if (savedMonHoc) setMonHocList(JSON.parse(savedMonHoc));
        if (savedTienDo) setTienDoList(JSON.parse(savedTienDo));
        if (savedMucTieu) setMucTieuList(JSON.parse(savedMucTieu));
    }, []);

    useEffect(() => {
        localStorage.setItem("monHoc", JSON.stringify(monHocList));
        }, [monHocList]);

        useEffect(() => {
        localStorage.setItem("tienDo", JSON.stringify(tienDoList));
        }, [tienDoList]);

        useEffect(() => {
        localStorage.setItem("mucTieu", JSON.stringify(mucTieuList));
    }, [mucTieuList]);

    const handleDeleteMonHoc = (id: number) => {
        setMonHocList(monHocList.filter(item => item.id !== id));
    };

    const handleDeleteTienDo = (id: number) => {
        setTienDoList(tienDoList.filter(item => item.id !== id));
    };

    const handleDeleteMucTieu = (id: number) => {
        setMucTieuList(mucTieuList.filter(item => item.id !== id));
    };

    const handleAddTienDo = () => {
    setEditingTienDo(null);
    tienDoForm.resetFields();
    setIsTienDoModalOpen(true);
    };

    const handleEditTienDo = (record: any) => {
        setEditingTienDo(record);
        tienDoForm.setFieldsValue({
            ...record,
            ngayHoc: dayjs(record.ngayHoc)
        });
        setIsTienDoModalOpen(true);
    };

    const handleSubmitTienDo = () => {
        tienDoForm.validateFields().then(values => {

            const newData = {
                ...values,
                id: editingTienDo ? editingTienDo.id : Date.now(),
                ngayHoc: values.ngayHoc.format("YYYY-MM-DD")
            };

            if (editingTienDo) {
                const updated = tienDoList.map(item =>
                    item.id === editingTienDo.id ? newData : item
                );
                setTienDoList(updated);
            } else {
                setTienDoList([...tienDoList, newData]);
            }

            setIsTienDoModalOpen(false);
        });
    };

    const danhMuc = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên môn học',
            dataIndex: 'tenMon',
            key: 'tenMonHoc',
        },
        {
            title: 'Thời lượng môn học (Tiết)',
            dataIndex: 'thoiLuongMonHoc',
            key: 'thoiLuongMonHoc',
        },
        {
            title: 'Nội dung',
            dataIndex: 'noiDung',
            key: 'noiDung',
        },
        {
            title: 'Thao tác',
            key: 'thaoTac',
            render: (_: any, record: any) => (
                <>
                    <Button danger onClick={() => handleDeleteMonHoc(record.id)}>Xóa</Button>
                    <Button type="primary" onClick={() => handleEditMonHoc(record)}>Sửa</Button>
                </>
            )
        },
    ];

    const handleAddMucTieu = () => {
        setEditingMucTieu(null);
        mucTieuForm.resetFields();
        setIsMucTieuModalOpen(true);
    };

    const handleEditMucTieu = (record: any) => {
        setEditingMucTieu(record);
        mucTieuForm.setFieldsValue(record);
        setIsMucTieuModalOpen(true);
    };

    const handleSubmitMucTieu = () => {
        mucTieuForm.validateFields().then(values => {

            const newData = {
                ...values,
                id: editingMucTieu ? editingMucTieu.id : Date.now()
            };

            if (editingMucTieu) {
                const updated = mucTieuList.map(item =>
                    item.id === editingMucTieu.id ? newData : item
                );
                setMucTieuList(updated);
            } else {
                setMucTieuList([...mucTieuList, newData]);
            }

            setIsMucTieuModalOpen(false);
        });
    };

    const tienDo = [
        {
            title: 'Tên môn học',
            dataIndex: 'tenMon',
            key: 'tenMon',
        },
        {
            title: 'Ngày học',
            dataIndex: 'ngayHoc',
            key: 'ngayHoc',
        },
        {
            title: 'Thời lượng (Tiết)',
            dataIndex: 'thoiLuong',
            key: 'thoiLuong',
        },
        {
            title: 'Nội dung',
            dataIndex: 'noiDung',
            key: 'noiDung',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Thao tác',
            key: 'thaoTac',
            render: (_: any, record: any) => (
                <>
                    <Button danger onClick={() => handleDeleteTienDo(record.id)}>Xóa</Button>
                    <Button type="primary" onClick={() => handleEditTienDo(record)}>Sửa</Button>
                </>
            )
        },
    ];
    const mucTieu = [
        {
            title: 'Tên môn học',
            dataIndex: 'tenMon',
            key: 'tenMon',
        },
        {
            title: 'Mục tiêu',
            dataIndex: 'mucTieu',
            key: 'mucTieu',
        },
        {
            title: 'Thời lượng (Tiết)',
            dataIndex: 'thoiLuongMonHoc',
            key: 'thoiLuongMonHoc',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
        },
        {
            title: 'Nội dung',
            dataIndex: 'noiDung',
            key: 'noiDung',
        },

        {
            title: 'Tiến độ',
            key: 'tienDo',
            render: (_: any, record: any) => (
                <>{record.mucTieu === record.tienDo ? <span style={{ color: 'green' }}>Đạt</span> : <span style={{ color: 'red' }}>Chưa đạt</span>}</>
            )
        },

        {
            title: 'Thao tác',
            key: 'thaoTac',
            render: (_: any, record: any) => (
                <>
                    <Button danger onClick={() => handleDeleteMucTieu(record.id)}>Xóa</Button>
                    <Button type="primary" onClick={() => handleEditMucTieu(record)}>Sửa</Button>
                </>
            )
        },
    ];

  return (<>
    <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Danh mục môn học" key="1">
            <Button type='primary' onClick={handleAddMonHoc}>
                Thêm môn học
            </Button>
            <Table dataSource={monHocList} columns={danhMuc} rowKey="id" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Tiến độ học tập" key="2">
            <Button type='primary' onClick={handleAddTienDo}>
                Thêm tiến độ
            </Button>
            <Table dataSource={tienDoList} columns={tienDo} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Mục tiêu hàng tháng" key="3">
            <Button type='primary' onClick={handleAddMucTieu}>
                Thêm mục tiêu
            </Button>
            <Table dataSource={mucTieuList} columns={mucTieu} />
        </Tabs.TabPane>
    </Tabs>
    <Modal
        title={editingMonHoc ? "Sửa môn học" : "Thêm môn học"}
        visible={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
    >
        <Form form={form} layout="vertical">
            <Form.Item
                name="tenMon"
                label="Tên môn"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="thoiLuongMonHoc"
                label="Thời lượng"
                rules={[{ required: true }]}
            >
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
                name="noiDung"
                label="Nội dung"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
        </Form>
    </Modal>
    <Modal
        title={editingTienDo ? "Sửa tiến độ học tập" : "Thêm tiến độ học tập"}
        visible={isTienDoModalOpen}
        onOk={handleSubmitTienDo}
        onCancel={() => setIsTienDoModalOpen(false)}
    >
        <Form form={tienDoForm} layout="vertical">
            <Form.Item name="tenMon" label="Tên môn" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="ngayHoc" label="Ngày học" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="thoiLuong" label="Thời lượng" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="ghiChu" label="Ghi chú">
                <Input />
            </Form.Item>
        </Form>
    </Modal>
    <Modal
        title={editingMucTieu ? "Sửa mục tiêu tháng" : "Thêm mục tiêu tháng"}
        visible={isMucTieuModalOpen}
        onOk={handleSubmitMucTieu}
        onCancel={() => setIsMucTieuModalOpen(false)}
    >
        <Form form={mucTieuForm} layout="vertical">

            <Form.Item name="tenMon" label="Tên môn" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item name="mucTieu" label="Mục tiêu (số tiết)" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="thoiLuongMonHoc" label="Tổng thời lượng môn" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="tienDo" label="Tiến độ hiện tại">
                <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="noiDung" label="Nội dung">
                <Input />
            </Form.Item>

            <Form.Item name="ghiChu" label="Ghi chú">
                <Input />
            </Form.Item>

        </Form>
    </Modal>
</>
    );
}

export default Bai2;