import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Descriptions, Select, Card, Space, Input, Checkbox, Divider, Typography} from 'antd';
import styles from './style.less'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';

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

export default function Outbound() {

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
                    name: "张三05张三",
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
            title: '集配单单号',
            dataIndex: 'name',
            align: 'center',
            width: 200
        },
        {
            title: '出库日期',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '路线',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '司机',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '车辆',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '出库（制单）人',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '出库（制单）时间',
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
            width: 200,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>打印</Typography.Link>
                    <Typography.Link type="danger">作废</Typography.Link>
                    <Typography.Link>详情</Typography.Link>
                </Space>
            )
        }
    ];

    const renderOutBoundCard = () => {
        return (
            <Card 
                size="small" 
                title="商品出库" 
                extra={
                    <Space>
                        <Checkbox>打印集配单</Checkbox>
                        <Button type="primary">出库</Button>
                    </Space>
                } 
                style={{marginTop: 20}}
            >
                <Space size={30} align="start">
                    <Card size="small" title="S1. 选择路线">
                        <Space direction="vertical">
                            <Checkbox>xxxx路线1</Checkbox>
                            <Checkbox>xxxx路线2</Checkbox>
                            <Checkbox>xxxx路线3</Checkbox>
                            <Checkbox>xxxx路线4</Checkbox>
                        </Space>
                    </Card>
                    <Card size="small" title="S2. 选择站点">
                        <Space direction="vertical">
                            提醒：送货顺序，从上到下
                            <Checkbox>xxxx路线1</Checkbox>
                            <Checkbox>xxxx路线2</Checkbox>
                            <Checkbox>xxxx路线3</Checkbox>
                            <Checkbox>xxxx路线4</Checkbox>
                        </Space>
                    </Card>
                    <Card size="small" title="S3. 选择已打包订单">
                        <Space direction="vertical">
                            <Checkbox>全部订单</Checkbox>
                            <Checkbox>xxxx订单1</Checkbox>
                            <Checkbox>xxxx订单2</Checkbox>
                            <Checkbox>xxxx订单3</Checkbox>
                        </Space>
                    </Card>
                    <Card size="small" title="S4. 选择当值司机">
                        <Space direction="vertical">
                            <Checkbox>司机1（SJ123456）</Checkbox>
                            <Checkbox>司机2（SJ123456）</Checkbox>
                            <Checkbox>司机3（SJ123456）</Checkbox>
                            <Checkbox>司机4（SJ123456）</Checkbox>
                        </Space>
                    </Card>
                    <Card size="small" title="S5. 选择车辆">
                        <Space direction="vertical">
                            <Checkbox>车辆1（苏A88888）</Checkbox>
                            <Checkbox>车辆2（苏A88888）</Checkbox>
                            <Checkbox>车辆3（苏A88888）</Checkbox>
                            <Checkbox>车辆4（苏A88888）</Checkbox>
                        </Space>
                    </Card>
                </Space>
                <Divider />
                <Descriptions
                    bordered
                    title="已选择配置"
                    size="small"
                >
                    <Descriptions.Item label="路线">xxxx路线1</Descriptions.Item>
                    <Descriptions.Item label="司机">司机1（SJ123456）</Descriptions.Item>
                    <Descriptions.Item label="车辆">车辆1（苏A88888）</Descriptions.Item>
                    <Descriptions.Item label="订单" span={2}>
                        订单1、订单2、订单3
                    </Descriptions.Item>
                    <Descriptions.Item label="送货站点">{'站点1 -> 站点3'}</Descriptions.Item>
                </Descriptions>
            </Card>
        )
    }

    const randerTableComponents = () => {
        return (
            <div>
                <Card size="small"  title="数据检索" extra={
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
                            placeholder="出库单ID" 
                            allowClear 
                        />
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择司机"
                            allowClear 
                        >
                            <Option value="1">农户1</Option>
                            <Option value="2">农户2</Option>
                        </Select>
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择路线"
                            allowClear 
                        >
                            <Option value="1">农户1</Option>
                            <Option value="2">农户2</Option>
                        </Select>
                    </Space>
                </Card>
                {renderOutBoundCard()}
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
                <TabPane tab="今日出库" key="1">
                    {randerTableComponents()}
                </TabPane>
                <TabPane tab="历史入库" key="2">
                    {randerTableComponents()}
                </TabPane>
            </Tabs>
        </div>
    )
}