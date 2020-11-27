import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, DatePicker, Divider} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
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

export default function OrderList() {

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
            title: '订单号',
            dataIndex: 'name',
            align: 'center',
            width: 200
        },
        {
            title: '下单日期',
            dataIndex: 'name',
            align: 'center',
            width: 160
        },
        {
            title: '售价（元）',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '农户分账（元）',
            dataIndex: 'name',
            align: 'center',
            width: 120
        },
        {
            title: '配送方式',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '支付方式',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '收货人',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '手机',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '收获地址',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '备注',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '订单状态',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>详情</Typography.Link>
                    <Typography.Link type="danger">改单</Typography.Link>
                    <Typography.Link type="danger">退款</Typography.Link>
                    <Typography.Link>拆单</Typography.Link>
                </Space>
            )
        }
    ];

    const randerTable = () => {
        return (
            <div>
                <Card size="small" title="数据检索" extra={
                    <Space>
                        <Button style={borderRadius} type="primary" size="middle" icon={<SearchOutlined />}>
                                搜索
                        </Button>
                    </Space>
                }>
                <Space>
                    <Input 
                        style={inputStyle} 
                        size="middle" 
                        placeholder="订单编号" 
                        allowClear 
                    />
                    <Select
                        size="middle"
                        style={inputStyle}
                        placeholder="订单状态"
                        allowClear 
                    >
                        <Option value="1">农户1</Option>
                        <Option value="2">农户2</Option>
                    </Select>
                    <Select
                        size="middle"
                        style={inputStyle}
                        placeholder="站点"
                        allowClear 
                    >
                        <Option value="1">农户1</Option>
                        <Option value="2">农户2</Option>
                    </Select>
                    <RangePicker style={borderRadius} size="middle" showTime={false} />
                    <Input 
                        style={inputStyle} 
                        size="middle" 
                        placeholder="收货人姓名" 
                        allowClear 
                    />
                    <Input 
                        style={inputStyle} 
                        size="middle" 
                        placeholder="手机号码" 
                        allowClear 
                    />
                </Space>
            </Card>
            <Space>
                <Button style={borderRadius} type="primary" size="middle">
                    批量打印
                </Button>
                <Button style={borderRadius} type="primary" size="middle">
                    合并订单
                </Button>
            </Space>
            <Table
                size="small"
                scroll={{ x: 2000 }}
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
                <TabPane tab="今日订单" key="1">
                    {randerTable()}
                </TabPane>
                <TabPane tab="昨日订单" key="2">
                    {randerTable()}
                </TabPane>
                <TabPane tab="全部订单" key="3">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}