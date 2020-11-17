import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Divider, Typography, Drawer, Descriptions, Image } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

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


const FarmerList = () => {

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
            title: '农户姓名',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '类别',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '联系人',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '地址',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '手机号码',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '合作状态',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '微信认证',
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
                    <Typography.Link onClick={() => handleFarmerDetailDrawerOpen(record)}>去审核</Typography.Link>
                    <Typography.Link>继续合作</Typography.Link>
                    <Typography.Link type="danger">暂停合作</Typography.Link>
                    <Typography.Link>详情</Typography.Link>
                </Space>
            )
        }
    ];

    const [farmerDetailDrawerProps, setFarmerDetailDrawerProps] = useState({
        visible: false,
        title: '',
    })
    const [farmerDetailDrawerData, setFarmerDetailDrawerData] = useState({})
    const [farmerDetailDrawerApplyLoading, setFarmerDetailDrawerApplyLoading] = useState(false)
    const [farmerDetailDrawerRefuseLoading, setFarmerDetailDrawerRefuseLoading] = useState(false)
    const handleFarmerDetailDrawerOpen = data => {
        setFarmerDetailDrawerProps({
            visible: true,
            title: ''
        })
        setFarmerDetailDrawerData(data)
    }
    const handleFarmerDetailDrawerClose = () => {
        setFarmerDetailDrawerProps({
            visible: false,
            title: ''
        })
        setFarmerDetailDrawerData({})
        setFarmerDetailDrawerApplyLoading(false)
        setFarmerDetailDrawerRefuseLoading(false)
    }

    //审核通过
    const handleFarmerDetailDrawerApply = () => {

    }

    //拒绝通过
    const handleFarmerDetailDrawerRefuse = () => {

    }

    return (
        <div>
            <div style={blockStyle}>
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
                    title={farmerDetailDrawerProps.title + "的农户资料"}
                    destroyOnClose
                    width={720}
                    onClose={handleFarmerDetailDrawerClose}
                    visible={farmerDetailDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={handleFarmerDetailDrawerApply} oading={farmerDetailDrawerApplyLoading} type="primary" style={{ marginRight: 8 }}>
                                审批通过
                            </Button>
                            <Button onClick={handleFarmerDetailDrawerRefuse} loading={farmerDetailDrawerRefuseLoading} type="primary" danger>
                                拒绝通过
                            </Button>
                        </div>
                    }
                >
                    <Descriptions bordered size="small">
                        <Descriptions.Item label="类别" span={3}>企业</Descriptions.Item>
                        <Descriptions.Item label="农场/供应商名称" span={3}>xxxxxx农场</Descriptions.Item>
                        <Descriptions.Item label="农场管理员手机号" span={3}>18269950607</Descriptions.Item>
                        <Descriptions.Item label="身份证号" span={3}>413026199212276543</Descriptions.Item>
                        <Descriptions.Item label="土地测量面积" span={3}>300m2</Descriptions.Item>
                        <Descriptions.Item label="土地测量面积图片" span={3}>
                            <Image width={160} src={'https://test-zmy.oss-cn-hangzhou.aliyuncs.com/fa65e131ddee409e9f0763752c93d9e4-image-b8cc4986-8cbd-43e3-820b-3d5a77e43297.jpg'} />
                            <Image width={160} src={'https://test-zmy.oss-cn-hangzhou.aliyuncs.com/fa65e131ddee409e9f0763752c93d9e4-image-b8cc4986-8cbd-43e3-820b-3d5a77e43297.jpg'} />
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </div>
        </div>
    )
}

export default FarmerList