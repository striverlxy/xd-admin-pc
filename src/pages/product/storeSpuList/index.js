import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, Drawer, Popconfirm, Divider, message, Modal} from 'antd';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'
import styles from './style.less'

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

export default function StoreSpuList() {

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

    const getStoreSpuList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/item/optional/store', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getStoreSpuList()
        getStoreList()
    }, [])

    const columns = [
        {
            title: 'spu名称',
            dataIndex: 'spuName',
            align: 'center',
        },
        {
            title: '商品分类',
            dataIndex: 'cateName',
            align: 'center',
        },
        {
            title: 'sku',
            align: 'center',
            render: record => <Typography.Link onClick={() => handleSkuListDrawerOpen(record)}>{record.skuCount}</Typography.Link>
        },
        {
            title: '今日库存',
            dataIndex: 'realInboundNum',
            align: 'center',
        },
        {
            title: '总销量',
            dataIndex: 'inboundStatus',
            align: 'center',
        }
    ];


    const [skuListDrawerProps, setSkuListDrawerProps] = useState({
        visible: false,
        storeSpu: {}
    })
    const [skuList, setSkuList] = useState([])
    const handleSkuListDrawerOpen = storeSpu => {
        setSkuListDrawerProps({
            visible: true,
            storeSpu
        })
        setSkuList(JSON.parse(storeSpu.skuDetail))
        // getSkuList(storeSpu.storeId)
    }
    const handleSkuListDrawerClose = () => {
        setSkuListDrawerProps({
            visible: false,
            storeSpu: {}
        })
        setSkuList([])
    }

    const skuColumns = [
        {
            title: '商品编号',
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
            title: '售价',
            dataIndex: 'salePrice',
            align: 'center',
        },
        {
            title: '农户分润比例',
            dataIndex: 'farmFeePercent',
            align: 'center',
            render: farmFeePercent => farmFeePercent + '%'
        },
        {
            title: '上架状态',
            dataIndex: 'isPub',
            align: 'center',
            render: isPub => isPub ? '上架' : '下架'
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 150,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleSkuFarmerModalOpen(record)}>供货农场</Typography.Link>
                    <Popconfirm placement="topLeft" title="确定删除该sku吗?" onConfirm={() => delSku(record)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const delSku = async sku => {
        let data = {
            id: sku.id,
            skuNo: sku.skuNo
        }
        await httpUtils.post(`/admin/item/optional/store/del/sku`, data)
        message.success("删除成功")
        //兼容
        let skus = skuList.slice()
        skus.splice(skus.findIndex(s => s.id == sku.id), 1)
        setSkuList(skus)
        getStoreSpuList()
    }


    const [storeSkuFarmList, setStoreSkuFarmList] = useState([])
    const getStoreSkuFarmList = async record => {
        let resp = await httpUtils.get('/admin/item/optional/store/sku/farms', {storeId: choosedStore.id, skuNo: record.skuNo})
        setStoreSkuFarmList(resp)
    }


    const [skuFarmerModalProps, setSkuFarmerModalProps] = useState({
        visible: false,
        sku: {}
    })
    const handleSkuFarmerModalOpen = sku => {
        setSkuFarmerModalProps({
            visible: true,
            sku
        })
        getStoreSkuFarmList(sku)
    }
    const handleSkuFarmerModalClose = () => {
        setSkuFarmerModalProps({
            visible: false,
            sku: {}
        })
        setStoreSkuFarmList([])
    }

    const movePosition = async (up, down) => {
        // let data = {
        //     upSiteId: routeSiteList[up].id,
        //     downSiteId: routeSiteList[down].id,
        // }
        // await httpUtils.post('/admin/route/site/priority/update', data)
        // message.success('调整成功')
        // getRouteSiteList(routeDrawerProps.route.id)
    }

    const skuFarmColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center'
        },
        {
            title: '农场编号',
            dataIndex: 'farmId',
            align: 'center'
        },
        {
            title: '农场名称',
            dataIndex: 'farmName',
            align: 'center'
        },
        {
            title: '供货优先级',
            dataIndex: 'priority',
            align: 'center'
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 150,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <ArrowUpOutlined className={styles.edit_icon}  />
                    <ArrowDownOutlined className={styles.edit_icon}  />
                </Space>
            )
        }
    ]

    const randerTableComponents = () => {
        return (
            <div>
                <Card title="数据检索" size="small" extra={
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
                            placeholder="入库单ID" 
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
                    size="small"
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data.dataList}
                    pagination={{
                        total: data.totalCount
                    }}
                    loading={tableLoading}
                    onChange={async (pagination, filters, sorter) => getStoreSpuList(pagination)}
                />
                <Drawer
                    title={`【${skuListDrawerProps.storeSpu.spuName}】的商品信息`}
                    destroyOnClose
                    width={1000}
                    onClose={handleSkuListDrawerClose}
                    visible={skuListDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Table
                        size="small"
                        bordered={true}
                        style={{marginTop: 12}}
                        columns={skuColumns}
                        rowKey={record => record.id}
                        dataSource={skuList}
                        pagination={false}
                        loading={tableLoading}
                    />
                    <Modal
                        destroyOnClose
                        title={skuFarmerModalProps.sku.spuName + '的供货农户'}
                        visible={skuFarmerModalProps.visible}
                        footer={false}
                        onCancel={handleSkuFarmerModalClose}
                    >
                        <Table
                            size="small"
                            bordered={true}
                            style={{marginTop: 12}}
                            columns={skuFarmColumns}
                            rowKey={record => record.id}
                            dataSource={storeSkuFarmList}
                            pagination={false}
                        />
                    </Modal>
                </Drawer>
            </div>
        )
    }
    
    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }} value={choosedStore.id}>
                        {
                            storeList.map((item, index) => (
                                <Select.Option value={item.id} key={index}>{item.storeName}</Select.Option>
                            ))
                        }
                    </Select>
                }
            >
                <TabPane tab="集配仓商品库管理" key="1">
                    {randerTableComponents()}
                </TabPane>
            </Tabs>
        </div>
    )
}