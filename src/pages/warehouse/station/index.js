import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Space, Divider} from 'antd';
import styles from './style.less'
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const inputStyle = { width: 160, borderRadius: 4 }
const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs;

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

export default function Station() {

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
        }, 100)
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '站点ID',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '站点名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '站点负责人',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '联系方式',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '站点地址',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '配送半径（km）',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '自提时间',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '营业状态',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '小程序认证',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link>编辑</Typography.Link>
                    <Typography.Link>营业</Typography.Link>
                    <Typography.Link type="danger">停业</Typography.Link>
                </Space>
            )
        }
    ];

    const randerTable = () => {
        return (
            <div>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />}>
                        添加
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
            </div>
        )
    }
    
    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }}>
                        <Select.Option value="1">成都集配仓</Select.Option>
                        <Select.Option value="2">上海集配仓</Select.Option>
                        <Select.Option value="3">南京集配仓</Select.Option>
                    </Select>
                }
            >
                <TabPane tab="全部站点" key="1">
                    {randerTable()}
                </TabPane>
                <TabPane tab="未营业站点" key="2">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}