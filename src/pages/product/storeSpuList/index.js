import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, Drawer, Popconfirm, Divider, message} from 'antd';
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

export default function StoreSpuList() {

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
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '商品分类',
            dataIndex: 'cateId',
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
        spu: {}
    })
    const [skuList, setSkuList] = useState([])
    const handleSkuListDrawerOpen = spu => {
        setSkuListDrawerProps({
            visible: true,
            spu
        })
        getSkuList(spu.spuNo)
    }
    const handleSkuListDrawerClose = () => {
        setSkuListDrawerProps({
            visible: false,
            spu: {}
        })
        setSkuList([])
    }

    const getSkuList = async spuNo => {
        let resp = await httpUtils.get('/admin/item/sku/list', {spuNo: spuNo})
        setSkuList(resp)
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
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <Popconfirm placement="topLeft" title="确定删除该sku吗?" onConfirm={() => delSku(record.skuNo)} okText="确定" cancelText="取消">
                    <Typography.Link type="danger">删除</Typography.Link>
                </Popconfirm>
            )
        }
    ]

    const delSku = async skuNo => {
        await httpUtils.post(`/admin/item/sku/del/${skuNo}`)
        message.success("删除成功")
        getSkuList(skuListDrawerProps.spu.spuNo)
    }

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
                    title={`【${skuListDrawerProps.spu.spuName}】的商品信息`}
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
                </Drawer>
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
                <TabPane tab="集配仓商品库管理" key="1">
                    {randerTableComponents()}
                </TabPane>
            </Tabs>
        </div>
    )
}