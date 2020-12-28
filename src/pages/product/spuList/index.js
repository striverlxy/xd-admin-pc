import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, DatePicker, Divider, Drawer, Form, Cascader, Switch, message, Modal, Popconfirm} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import PicturesWall from '../../../components/picturesWall'
import httpUtils from '../../../utils/request'

const { Option } = Select;
const { RangePicker } = DatePicker;
const inputStyle = { width: 160, borderRadius: 4 }
const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 24 },
};

const skuModalFormLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

export default function SpuList() {

    const [spuList, setSpuList] = useState({})
    const [tableLoading, setTableLoading] = useState(false)

    const getSpuList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/item/spu/list', params)
        setSpuList(resp)

        setTableLoading(false)
    }  

    const [cateOption, setCateOption] = useState([])

    const getCateList = async () => {
        let resp = await httpUtils.get('/admin/cate/list')
        let wrap = wrapTableList(resp.children)
        setCateOption(wrap)
    }

    const wrapTableList = cates => {
        let temp = []
        cates.map(item => {
            let obj = {
                value: item.tree.id,
                label: item.tree.cateName
            }
            if (item.children && item.children.length > 0) {
                obj.children = wrapTableList(item.children)
            }
            temp.push(obj)
        })

        return temp
    }

    useEffect(() => {
        getCateList()
        getSpuList()
    }, [])

    const columns = [
        {
            title: 'SPU编号',
            dataIndex: 'spuNo',
            align: 'center',
        },
        {
            title: '商品名称',
            dataIndex: 'spuName',
            align: 'center',
        },
        {
            title: '商品分类',
            dataIndex: 'cateId',
            align: 'center',
        },
        {
            title: '商品状态',
            dataIndex: 'isPub',
            align: 'center',
            render: isPub => isPub ? '上架' : '下架'
        },
        {
            title: '划线价（元）',
            dataIndex: 'underlinePrice',
            align: 'center',
        },
        // {
        //     title: '农户分账比例（%）',
        //     dataIndex: 'name',
        //     align: 'center',
        // },
        // {
        //     title: '总销量',
        //     dataIndex: 'name',
        //     align: 'center',
        // },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 200,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleSkuListDrawerOpen(record)}>商品列表</Typography.Link>
                    <Typography.Link onClick={() => handleSpuDrawerOpen(record)}>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                </Space>
            )
        }
    ];


    const [spuDrawerProps, setSpuDrawerProps] = useState({
        visible: false,
        title: '新增商品'
    })
    const [spuDrawerData, setSpuDrawerData] = useState({})
    const handleSpuDrawerOpen = (data = {}) => {
        setSpuDrawerProps({
            visible: true,
            title: data.id ? '编辑商品' : '新增商品'
        })
        if (data.id) {
            setSpuDrawerData(data)
        }
    }
    const handleSpuDrawerClose = () => {
        setSpuDrawerProps({
            visible: false,
            title: '新增商品'
        })
        setSpuDrawerData({})
    }
    const handleSpuDrawerOk = async () => {
        let data = {
            cateId: spuDrawerData.cateId,
            spuName: spuDrawerData.spuName,
            underlinePrice: spuDrawerData.underlinePrice,
            note: spuDrawerData.note,
            bannerUrls: spuDrawerData.bannerUrls,
            detailUrls: spuDrawerData.detailUrls,
        }
        await httpUtils.post('/admin/item/spu/add', data)
        message.success('spu添加成功')
        getSpuList()
    }



    const [cateAttrKeyList, setCateAttrKeyList] = useState([])
    const getCateAttrKeyList = async cateId => {
        let resp = await httpUtils.get('/admin/item/attr/key/list', {cateId: cateId, pageSize: 10000, pageNum: 1})
        let attrKeyList = resp.dataList
        for(let i = 0; i < attrKeyList.length; i++) {
            let valueList = await getAttrValue(attrKeyList[i].id)
            attrKeyList[i].valueList = valueList
        }
        setCateAttrKeyList(attrKeyList)
        console.log(attrKeyList)
    }
    const getAttrValue = async keyId => {
        let resp = await httpUtils.get(`/admin/item/attr/values/${keyId}`, {})
        return resp
    }

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
        getCateAttrKeyList(spu.cateId)
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
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleSkuModalOpen(record)}>编辑</Typography.Link>
                    <Popconfirm placement="topLeft" title="确定删除该sku吗?" onConfirm={() => delSku(record.skuNo)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ]





    const [skuModalProps, setSkuModalProps] = useState({
        visible: false,
        title: '新增商品'
    })
    const [skuModalData, setSkuModalData] = useState({})
    const [skuModalLoading, setSkuModalLoading] = useState(false)
    const handleSkuModalOpen = (data = {}) => {
        setSkuModalProps({
            visible: true,
            title: data.id ? '更新商品': '新增商品'
        })

        setSkuModalData(data)
    }
    const handleSkuModalClose = () => {
        setSkuModalProps({
            visible: false,
            title: '新增商品'
        })
        setSkuModalData({})
        setSkuModalLoading(false)
    }
    const handleSkuModalOk = async () => {
        let data = {
            spuNo: skuListDrawerProps.spu.spuNo,
            cateId: skuListDrawerProps.spu.cateId,
            spuName: skuListDrawerProps.spu.spuName,
            farmFeePercent: skuModalData.farmFeePercent,
            salePrice: skuModalData.salePrice,
            isPub: skuModalData.isPub
        }

        let attrList = []
        //设置商品属性
        cateAttrKeyList.map(item => {
            if (item.selected) {
                let valueId = item.selected

                let pos = item.valueList.findIndex(value => value.id == item.selected)
                let valueName = item.valueList[pos].valueName

                let keyId = item.id
                let unit = item.unit
                let keyName = item.keyName
                attrList.push({
                    keyId,
                    keyName,
                    valueName,
                    valueId,
                    unit
                })
            }
            
        })
        data.attrJson = JSON.stringify(attrList)

        if (skuModalData.id) {
            data.id = skuModalData.id
        }

        console.log(data)
    
        setSkuModalLoading(true)
        await httpUtils.post(data.id ? '/admin/item/sku/update' : '/admin/item/sku/add', data)
        message.success('操作成功')
        handleSkuModalClose()
        getSkuList(skuListDrawerProps.spu.spuNo)
    }
    
    const delSku = async skuNo => {
        await httpUtils.post(`/admin/item/sku/del/${skuNo}`)
        message.success("删除成功")
        getSkuList(skuListDrawerProps.spu.spuNo)
    }

    const setSkuAttrSelectValue = (e, index) => {
        let attrKeyList = cateAttrKeyList.slice()
        attrKeyList[index].selected = e
        // setCateAttrKeyList(attrKeyList)
    }
    
    return (
        <div style={blockStyle}>
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
                        placeholder="商品名称" 
                        allowClear 
                    />
                    <Select
                        size="middle"
                        style={inputStyle}
                        placeholder="商品分类"
                        allowClear 
                    >
                        <Option value="1">农户1</Option>
                        <Option value="2">农户2</Option>
                    </Select>
                    <Input 
                        style={inputStyle} 
                        size="middle" 
                        placeholder="SKU编码" 
                        allowClear 
                    />
                </Space>
            </Card>
            <Space style={{marginTop: 10}}>
                <Button style={borderRadius} type="primary" size="middle">
                    批量操作
                </Button>
                <Button style={borderRadius} type="primary" size="middle" onClick={handleSpuDrawerOpen}>
                    添加商品
                </Button>
            </Space>
            <Table
                size="small"
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={spuList.dataList}
                pagination={{
                    total: spuList.totalCount
                }}
                loading={tableLoading}
                onChange={async (pagination, filters, sorter) => getSpuList(pagination)}
            />
            <Drawer
                title={spuDrawerProps.title}
                destroyOnClose
                width={720}
                onClose={handleSpuDrawerClose}
                visible={spuDrawerProps.visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                        >
                        <Button style={{ marginRight: 8 }} onClick={handleSpuDrawerClose}>
                            取消
                        </Button>
                        <Button type="primary" onClick={handleSpuDrawerOk}>
                            保存
                        </Button>
                    </div>
                }
            >
                <Form size="large" {...layout}>
                    <Typography.Title level={4}>商品分类</Typography.Title>
                    <Form.Item
                        label="商品分类"
                    >
                        <Cascader 
                            size="large"
                            options={cateOption}
                            onChange={e => {
                                setSpuDrawerData({
                                    ...spuDrawerData,
                                    cateId: e[e.length - 1]
                                })
                            }} 
                            placeholder="请选择商品分类" 
                        />
                    </Form.Item>
                    <Typography.Title level={4}>基本信息</Typography.Title>
                    <Form.Item
                        label="商品名"
                    >
                        <Input  
                            size="large"  
                            placeholder="请输入商品名" 
                            defaultValue={spuDrawerData.spuName}
                            onChange={e => {
                                const { value } = e.target
                                setSpuDrawerData({
                                    ...spuDrawerData,
                                    spuName: value
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="简介"
                    >
                        <Input  
                            size="large"  
                            placeholder="请输入简介" 
                            defaultValue={spuDrawerData.note}
                            onChange={e => {
                                const { value } = e.target
                                setSpuDrawerData({
                                    ...spuDrawerData,
                                    note: value
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="商品图"
                    >
                        <PicturesWall saveFileList={e => 
                            setSpuDrawerData({
                                ...spuDrawerData,
                                bannerUrls: e
                            })
                        } />
                    </Form.Item>
                    <Form.Item
                        label="商品详情"
                    >
                        <PicturesWall saveFileList={e => 
                            setSpuDrawerData({
                                ...spuDrawerData,
                                detailUrls: e
                            })
                        } />
                    </Form.Item>
                    <Form.Item
                        label="上架状态"
                    >
                        <Switch checkedChildren="上架" unCheckedChildren="下架" defaultValue={spuDrawerData.isPub} />
                    </Form.Item>
                </Form>
            </Drawer>
            <Drawer
                title={`【${skuListDrawerProps.spu.spuName}】的商品信息`}
                destroyOnClose
                width={1000}
                onClose={handleSkuListDrawerClose}
                visible={skuListDrawerProps.visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Button style={borderRadius} type="primary" size="middle" onClick={() => handleSkuModalOpen()}>
                    添加商品
                </Button>
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
                    title={skuModalProps.title}
                    visible={skuModalProps.visible}
                    onOk={handleSkuModalOk}
                    confirmLoading={skuModalLoading}
                    onCancel={handleSkuModalClose}
                >
                    <Form size="large" {...skuModalFormLayout}>
                        {
                            cateAttrKeyList.map((item, index) => (
                                <Form.Item
                                    key={index}
                                    label={item.keyName}
                                >
                                    <Select placeholder="请选择规格值" onChange={e => setSkuAttrSelectValue(e, index)}>
                                        {
                                            item.valueList.map((itm, idx) => (
                                                <Select.Option value={itm.id} key={idx}>{itm.valueName}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            ))
                        }
                        <Form.Item
                            label="售价"
                        >
                            <Input  
                                size="large"
                                type="number"
                                placeholder="请输入售价" 
                                defaultValue={skuModalData.salePrice}
                                onChange={e => {
                                    const { value } = e.target
                                    setSkuModalData({
                                        ...skuModalData,
                                        salePrice: value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="农户分成比例"
                        >
                            <Input  
                                size="large"
                                type="number"
                                placeholder="请输入农户分成比例" 
                                defaultValue={skuModalData.farmFeePercent}
                                onChange={e => {
                                    const { value } = e.target
                                    setSkuModalData({
                                        ...skuModalData,
                                        farmFeePercent: value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="上架状态"
                        >
                            <Switch 
                                checkedChildren="上架" 
                                unCheckedChildren="下架" 
                                defaultValue={skuModalData.isPub} 
                                onChange={e => {
                                    setSkuModalData({
                                        ...skuModalData,
                                        isPub: e ? true : false
                                    })
                                }} 
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </Drawer>
        </div>
    )
}