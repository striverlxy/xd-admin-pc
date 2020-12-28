import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, Divider, Drawer} from 'antd';
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

    const [storeList, setStoreList] = useState([])
    const [choosedStore, setChoosedStore] = useState({})
    const getStoreList = async () => {
        let resp = await httpUtils.get('/admin/store/list')
        setStoreList(resp)
        if (resp.length > 0) {
            setChoosedStore(resp[0])
        }
    }

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
        getStoreList()
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
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleSlaveCollectDrawerOpen(record)}>分时集采单</Typography.Link>
                    <Typography.Link>打印</Typography.Link>
                </Space>
            )
        }
    ];

    const [slaveCollectDrawerProps, setSlaveCollectDrawerProps] = useState({
        visible: false,
        masterCollect: {}
    })
    const [slaveCollectList, setSlaveCollectList] = useState([])
    const [slaveCollectTableLoading, setSlaveCollectTableLoading] = useState(false)
    const handleSlaveCollectDrawerOpen = masterCollect => {
        setSlaveCollectDrawerProps({
            visible: true,
            masterCollect
        })
        getSlaveCollectList(masterCollect.collectMasterOrderNo)
    }

    const getSlaveCollectList = async collectMasterOrderNo => {
        setSlaveCollectTableLoading(true)
        let resp = await httpUtils.get(`/admin/order/collect/slaveByMaster/${collectMasterOrderNo}`)
        setSlaveCollectList(resp)
        setSlaveCollectTableLoading(false)
    }

    const handleSlaveCollectDrawerClose = () => {
        setSlaveCollectDrawerProps({
            visible: false,
            masterCollect: {}
        })
        setSlaveCollectList([])
    }

    const slaveCollectColumns = [
        {
            title: '单号',
            dataIndex: 'collectOrderNo',
            align: 'center',
        },
        {
            title: 'spu编号',
            dataIndex: 'spuNo',
            align: 'center',
        },
        {
            title: 'spu名称',
            dataIndex: 'spuName',
            align: 'center',
        },
        {
            title: 'sku编号',
            dataIndex: 'skuNo',
            align: 'center',
        },
        {
            title: '商品属性',
            dataIndex: 'attrJson',
            align: 'center',
            render: attrJson => {
                if (attrJson != null && attrJson != undefined && attrJson != '') {
                    let attrList = JSON.parse(attrJson)
                    return (
                        <Space direction="vertical">
                            {
                                attrList.map((item, index) => {
                                    return (
                                        <span key={index}>{`${item.keyName}: ${item.valueName}${item.unit}`}</span>
                                    )
                                })
                            }
                        </Space>
                    )
                }
            }
        },
        {
            title: 'sku数量',
            dataIndex: 'skuNum',
            align: 'center',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
        },
    ]

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
                <Drawer
                    title={`【${slaveCollectDrawerProps.masterCollect.collectMasterOrderNo}】的分时集采单`}
                    destroyOnClose
                    width={1000}
                    onClose={handleSlaveCollectDrawerClose}
                    visible={slaveCollectDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Table
                        size="small"
                        bordered={true}
                        style={{marginTop: 12}}
                        columns={slaveCollectColumns}
                        rowKey={record => record.id}
                        dataSource={slaveCollectList}
                        pagination={false}
                        loading={slaveCollectTableLoading}
                    />
                </Drawer>
            </div>
        )
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
                <TabPane tab="集采单" key="1">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}