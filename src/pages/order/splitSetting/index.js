import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Divider, Typography, Drawer, Descriptions, Image } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const borderRadius = { borderRadius: 4 }
const inputStyle = { width: 160, borderRadius: 4 }
const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}


const SplitSetting = () => {

    const [data, setData] = useState([])
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 200
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            let data = [
                {
                    id: 1,
                    name: "张三",
                    gender: 1,
                    email: '1@123'
                },
                {
                    id: 2,
                    name: "张三02",
                    gender: 1,
                    email: '1@123'
                },
                {
                    id: 3,
                    name: "张三03",
                    gender: 2,
                    email: '1@123'
                },
                {
                    id: 4,
                    name: "张三04张三04张三04",
                    gender: 2,
                    email: '1@123'
                },
                {
                    id: 5,
                    name: "张三05",
                    gender: 1,
                    email: '1@123'
                },
                {
                    id: 6,
                    name: "张三06",
                    gender: 1,
                    email: '1@123'
                }
            ]
            setData(data)
            setLoading(false)
        }, 2000)
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '拆单规则',
            dataIndex: 'name',
            align: 'center',
            width: 700
        },
        {
            title: '优先级',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleSplitSettingDrawerOpen(record)}>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link type="danger">停用</Typography.Link>
                </Space>
            )
        }
    ];

    const [splitSettingDrawerProps, setSplitSettingDrawerProps] = useState({
        visible: false,
        title: '',
    })
    const [splitSettingDrawerData, setSplitSettingDrawerData] = useState({})
    const [splitSettingDrawerApplyLoading, setSplitSettingDrawerApplyLoading] = useState(false)
    const [splitSettingDrawerRefuseLoading, setSplitSettingDrawerRefuseLoading] = useState(false)
    const handleSplitSettingDrawerOpen = data => {
        setSplitSettingDrawerProps({
            visible: true,
            title: ''
        })
        setSplitSettingDrawerData(data)
    }
    const handleSplitSettingDrawerClose = () => {
        setSplitSettingDrawerProps({
            visible: false,
            title: ''
        })
        setSplitSettingDrawerData({})
        setSplitSettingDrawerApplyLoading(false)
        setSplitSettingDrawerRefuseLoading(false)
    }

    const handleSplitSettingDrawerOk = () => {

    }


    return (
        <div>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={handleSplitSettingDrawerOpen}>
                        增加拆单规则
                    </Button>
                </Space>
                <Table
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                />
                <Drawer
                    title={splitSettingDrawerProps.title + "拆单规则"}
                    destroyOnClose
                    width={720}
                    onClose={handleSplitSettingDrawerClose}
                    visible={splitSettingDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={handleSplitSettingDrawerOk} oading={splitSettingDrawerApplyLoading} type="primary" style={{ marginRight: 8 }}>
                                保存
                            </Button>
                            <Button onClick={handleSplitSettingDrawerClose} loading={splitSettingDrawerRefuseLoading} type="primary" danger>
                                关闭
                            </Button>
                        </div>
                    }
                >
                    <Space direction="vertical">

                        <Space>
                            <Select size="middle" placeholder="请选择商品分类">
                                <Option value="1">商品分类1</Option>
                                <Option value="2">商品分类2</Option>
                            </Select>
                            类商品和
                            <Select size="middle" placeholder="请选择商品分类">
                                <Option value="1">商品分类1</Option>
                                <Option value="2">商品分类2</Option>
                            </Select>
                            类商品在同一订单时,
                        </Space>
                        <Space>
                            <Select size="middle" placeholder="请选择商品分类">
                                <Option value="1">商品分类1</Option>
                                <Option value="2">商品分类2</Option>
                            </Select>
                            类商品拆成单独的订单
                        </Space>
                        <Space>
                            优先级: <Input size="middle" width={100} type="number"></Input>
                        </Space>
                    </Space>
                </Drawer>
            </div>
        </div>
    )
}

export default SplitSetting