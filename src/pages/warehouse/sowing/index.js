import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input} from 'antd';
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

export default function Sowing() {

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
        }, 2000)
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            align: 'center',
            width: 200
        },
        {
            title: '商品ID',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '规格',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: 'SKU编号',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '供货编号',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '商品数量',
            dataIndex: 'name',
            align: 'center',
        },
    ];

    const renderTable = () => {
        return (
            <Card size="small" title="xxx路线1" extra={<a href="#">More</a>}>
                <Table
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                />
            </Card>
        )
    }

    const randerTableComponents = () => {
        return (
            <div>
                <Card title="数据检索" extra={
                    <Space>
                        <Button style={borderRadius} type="primary" size="middle" icon={<SearchOutlined />}>
                                搜索
                        </Button>
                    </Space>
                }>
                    <Space>
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择配送路线"
                            allowClear 
                        >
                            <Option value="1">农户1</Option>
                            <Option value="2">农户2</Option>
                        </Select>
                    </Space>
                </Card>
                <Space>
                    <Tabs tabPosition='left' className={styles.tableTab}>
                        <TabPane tab="xxx路线1" key="1">
                            {renderTable()}
                        </TabPane>
                        <TabPane tab="xxx路线2" key="2">
                            {renderTable()}
                        </TabPane>
                        <TabPane tab="xxx路线3" key="3">
                            {renderTable()}
                        </TabPane>
                    </Tabs>
                </Space>
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
                <TabPane tab="今日播种" key="1">
                    {randerTableComponents()}
                </TabPane>
                <TabPane tab="昨日播种" key="2">
                    {randerTableComponents()}
                </TabPane>
                <TabPane tab="历史播种" key="3">
                    {randerTableComponents()}
                </TabPane>
            </Tabs>
        </div>
    )
}