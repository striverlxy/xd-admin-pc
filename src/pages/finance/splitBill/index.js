import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, Image, Tabs, Select, Descriptions } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'
import { renderToString } from 'react-dom/server'

const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const SplitBill = () => {
    
    const [storeList, setStoreList] = useState([])
    const [choosedStore, setChoosedStore] = useState({})
    const getStoreList = async () => {
        let resp = await httpUtils.get('/admin/store/list')
        setStoreList(resp)
        if (resp.length > 0) {
            setChoosedStore(resp[0])
        }
    }

    const [billList, setBillList] = useState({})
    const [tableLoading, setTableLoading] = useState(false)

    const getFeeTicketList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/feeTicket/page', params)
        setBillList(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getFeeTicketList()
        getStoreList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '分账单id',
            dataIndex: 'ticketNo',
            align: 'center',
        },
        {
            title: '供货农户',
            dataIndex: 'farmName',
            align: 'center',
        },
        {
            title: '集配仓',
            dataIndex: 'storeName',
            align: 'center',
        },
        {
            title: '生成时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => print(record)}>打印</Typography.Link>
                    <Typography.Link>详情</Typography.Link>
                </Space>
            )
        }
    ]

    const print = record => {
        window.document.body.innerHTML = renderToString(
            <div>
                <Descriptions
                    bordered
                    size="small"
                    title="分账单"
                >
                    <Descriptions.Item label="序号" span={3}>{record.id}</Descriptions.Item>
                    <Descriptions.Item label="分账单编号" span={3}>{record.ticketNo}</Descriptions.Item>
                    <Descriptions.Item label="供货农户" span={3}>{record.farmName}</Descriptions.Item>
                    <Descriptions.Item label="集配仓" span={3}>{record.storeName}</Descriptions.Item>
                    <Descriptions.Item label="生成时间" span={3}>{record.createTime}</Descriptions.Item>
                </Descriptions>
            </div>
        )
        window.print(); 
        window.location.reload();
    }

    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }} value={choosedStore.id} onChange={(e1, e2) => {
                        setChoosedStore({
                            id: e2.value,
                            storeName: e2.children
                        })
                    }}>
                        {
                            storeList.map((item, index) => (
                                <Select.Option value={item.id} key={index}>{item.storeName}</Select.Option>
                            ))
                        }
                    </Select>
                }
            >
                <TabPane tab="管理分账单" key="1">
                    <Table
                        size="small"
                        bordered={true}
                        style={{marginTop: 12}}
                        columns={columns}
                        rowKey={record => record.id}
                        dataSource={billList.dataList}
                        pagination={{
                            total: billList.totalCount
                        }}
                        loading={tableLoading}
                        onChange={async (pagination, filters, sorter) => getFeeTicketList(pagination)}
                    />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default SplitBill