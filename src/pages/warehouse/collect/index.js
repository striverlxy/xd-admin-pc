import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input} from 'antd';
import styles from './style.less'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

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

export default function Collect() {

    const [data, setData] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const getCollectList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/order/collect/master/list', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getCollectList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '集采单ID',
            dataIndex: 'collectMasterOrderNo',
            align: 'center',
        },
        {
            title: '供货农户',
            dataIndex: 'farmName',
            align: 'center',
        },
        {
            title: '分时集采单',
            dataIndex: 'collectSlaveOrderCount',
            align: 'center',
        },
        {
            title: '收货集配仓',
            dataIndex: 'storeName',
            align: 'center',
        },
        {
            title: '预计送货时间',
            dataIndex: 'expectTime',
            align: 'center',
        },
        {
            title: '订单发货时间',
            dataIndex: 'orderTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Typography.Link>打印</Typography.Link>
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
                        placeholder="集采单ID" 
                        allowClear 
                    />
                    <Select
                        size="middle"
                        style={borderRadius}
                        placeholder="请选择供货农户"
                        allowClear 
                    >
                        <Option value="1">农户1</Option>
                        <Option value="2">农户2</Option>
                    </Select>
                </Space>
            </Card>
            <Table
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={data.dataList}
                pagination={{
                    total: data.totalCount
                }}
                loading={tableLoading}
                onChange={async (pagination, filters, sorter) => getCollectList(pagination)}
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
                <TabPane tab="今日集采单" key="1">
                    {randerTable()}
                </TabPane>
                <TabPane tab="昨日集采单" key="2">
                    {randerTable()}
                </TabPane>
                <TabPane tab="历史集采单" key="3">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}