import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Space, Divider} from 'antd';
import styles from './style.less'
import { PlusOutlined } from '@ant-design/icons';
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

export default function Station() {

    const [data, setData] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const getStationList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/site/page', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getStationList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '站点名称',
            dataIndex: 'siteName',
            align: 'center',
        },
        {
            title: '站点负责人',
            dataIndex: 'contactName',
            align: 'center',
        },
        {
            title: '联系方式',
            dataIndex: 'contactPhone',
            align: 'center',
        },
        {
            title: '站点地址',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '配送半径（km）',
            dataIndex: 'serviceRadius',
            align: 'center',
        },
        {
            title: '自提时间',
            align: 'center',
            render: record => record.liftStartTime + "-" + record.liftEndTime
        },
        {
            title: '营业状态',
            dataIndex: 'busyStatus',
            align: 'center',
        },
        // {
        //     title: '小程序认证',
        //     dataIndex: 'name',
        //     align: 'center',
        // },
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
                    dataSource={data.dataList}
                    pagination={{
                        total: data.totalCount
                    }}
                    loading={tableLoading}
                    onChange={async (pagination, filters, sorter) => getStationList(pagination)}
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