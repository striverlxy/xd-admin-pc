import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Divider, Typography } from 'antd';
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
        render: (text, record) => (
            <Space split={<Divider type="vertical" />}>
                <Typography.Link>去审核</Typography.Link>
                <Typography.Link>继续合作</Typography.Link>
                <Typography.Link type="danger">暂停合作</Typography.Link>
                <Typography.Link>详情</Typography.Link>
            </Space>
        )
    }
];

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
            </div>
        </div>
    )
}

export default FarmerList