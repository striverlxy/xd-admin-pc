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

export default function Sowing() {

    const [data, setData] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const getSowingList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/sowing/list', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getSowingList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '商品名称',
            dataIndex: 'spuName',
            align: 'center',
            width: 200
        },
        {
            title: '商品ID',
            dataIndex: 'spuNo',
            align: 'center',
        },
        // {
        //     title: '规格',
        //     dataIndex: 'name',
        //     align: 'center',
        // },
        {
            title: 'SKU编号',
            dataIndex: 'skuNo',
            align: 'center',
        },
        {
            title: '供货编号',
            dataIndex: 'provideNo',
            align: 'center',
        },
        {
            title: '商品数量',
            dataIndex: 'skuCount',
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
                    dataSource={data.dataList}
                    pagination={{
                        total: data.totalCount
                    }}
                    loading={tableLoading}
                    onChange={async (pagination, filters, sorter) => getSowingList(pagination)}
                />
            </Card>
        )
    }

    const randerTableComponents = () => {
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