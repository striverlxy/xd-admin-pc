import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, message, Modal, Form, Input, Drawer, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'
import { useLocation } from 'react-router-dom';

const borderRadius = { borderRadius: 4 }

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const Specifications = () => {

    const { state } = useLocation()

    const [specificationList, setSpecificationList] = useState({})
    const [tableLoading, setTableLoading] = useState(false)

    useEffect(() => {
        getSpecificationList()
    }, [])

    const getSpecificationList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
            cateId: state.cate.id
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/item/attr/key/list', params)
        setSpecificationList(resp)
        setTableLoading(false)
    }
    
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '规格名称',
            dataIndex: 'keyName',
            align: 'center',
        },
        {
            title: '规格单位',
            dataIndex: 'unit',
            align: 'center',
        },
        {
            title: '添加时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleAttrValueListDrawerOpen(record)}>规格值</Typography.Link>
                    <Typography.Link onClick={() => handleAttrKeyModalOpen(record)}>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                </Space>
            )
        }
    ]

    const [attrKeyModalProps, setAttrKeyModalProps] = useState({
        visible: false,
        title: '新增规格'
    })
    const [attrKeyModalData, setAttrKeyModalData] = useState({})
    const [attrKeyModalLoading, setAttrKeyModalLoading] = useState(false)
    const handleAttrKeyModalOpen = (data = {}) => {
        setAttrKeyModalProps({
            visible: true,
            title: data.id ? '更新规格': '新增规格'
        })
        setAttrKeyModalData(data)
    }
    const handleAttrKeyModalClose = () => {
        setAttrKeyModalProps({
            visible: false,
            title: '新增规格'
        })
        setAttrKeyModalData({})
        setAttrKeyModalLoading(false)
    }
    const handleAttrKeyModalOk = async () => {
        let data = {
            cateId: state.cate.id,
            keyName: attrKeyModalData.keyName,
            unit: attrKeyModalData.unit
        }
        if (attrKeyModalData.id) {
            data.id = attrKeyModalData.id
        }
        setAttrKeyModalLoading(true)
        await httpUtils.post(data.id ? '/admin/item/attr/key/update': '/admin/item/attr/key/add', data)
        setAttrKeyModalLoading(false)
        message.success('操作成功')
        handleAttrKeyModalClose()
        await getSpecificationList()
    }


    const [attrValueListDrawerProps, setAttrValueListDrawerProps] = useState({
        visible: false,
        attrKey: {}
    })
    const [attrValueList, setAttrValueList] = useState([])
    const handleAttrValueListDrawerOpen = async attrKey => {
        setAttrValueListDrawerProps({
            visible: true,
            attrKey
        })
        await getAttrValueList(attrKey.id)
    }
    const handleAttrValueListDrawerClose = () => {
        setAttrValueListDrawerProps({
            visible: false,
            attrKey: {}
        })
        setAttrValueList([])
    }

    const getAttrValueList = async keyId => {
        let resp = await httpUtils.get(`/admin/item/attr/values/${keyId}`)
        setAttrValueList(resp)
    }

    const attrValueListColumns = [
        {
            title: '编号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '规格值',
            dataIndex: 'valueName',
            align: 'center',
        },
        {
            title: '添加时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleAttrValueModalOpen(record)}>编辑</Typography.Link>
                    <Popconfirm placement="topLeft" title="确定删除该规格值吗?" onConfirm={() => delAttrValue(record.id)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const [attrValueModalProps, setAttrValueModalProps] = useState({
        visible: false,
        title: '新增规格值'
    })
    const [attrValueModalData, setAttrValueModalData] = useState({})
    const [attrValueModalLoading, setAttrValueModalLoading] = useState(false)
    const handleAttrValueModalOpen = (data = {}) => {
        setAttrValueModalProps({
            visible: true,
            title: data.id ? '更新': '新增规格值'
        })
        setAttrValueModalData(data)
    }
    const handleAttrValueModalClose = () => {
        setAttrValueModalProps({
            visible: false,
            title: '新增规格值'
        })
        setAttrValueModalData({})
        setAttrValueModalLoading(false)
    }
    const handleAttrValueModalOk = async () => {
        let data = {
            keyId: attrValueListDrawerProps.attrKey.id,
            valueName: attrValueModalData.valueName
        }
        if (attrValueModalData.id) {
            data.id = attrValueModalData.id
        }

        setAttrValueModalLoading(true)
        await httpUtils.post(data.id ? '/admin/item/attr/value/update' : '/admin/item/attr/value/add', data)
        message.success('操作成功')
        handleAttrValueModalClose()
        getAttrValueList(attrValueListDrawerProps.attrKey.id)
    }

    const delAttrValue = async valueId => {
        await httpUtils.post(`/admin/item/attr/value/del/${valueId}`)
        message.success("删除成功")
        getAttrValueList(attrValueListDrawerProps.attrKey.id)
    }

    return (
        <div style={blockStyle}>
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={(() => handleAttrKeyModalOpen())}>
                    新增商品规格
                </Button>
            </Space>
            <Table
                size="small"
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={specificationList.dataList}
                pagination={{
                    total: specificationList.totalCount
                }}
                loading={tableLoading}
                onChange={async (pagination, filters, sorter) => getSpecificationList(pagination)}
            />
            <Modal
                destroyOnClose
                title={attrKeyModalProps.title}
                visible={attrKeyModalProps.visible}
                onOk={handleAttrKeyModalOk}
                confirmLoading={attrKeyModalLoading}
                onCancel={handleAttrKeyModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="规格名称"
                    >
                        <Input 
                            value={attrKeyModalData.keyName} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setAttrKeyModalData({
                                    ...attrKeyModalData,
                                    keyName: value
                                })
                            }}  
                            placeholder="请输入规格名称" />
                    </Form.Item>
                    <Form.Item
                        label="单位名称"
                    >
                        <Input 
                            value={attrKeyModalData.unit} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setAttrKeyModalData({
                                    ...attrKeyModalData,
                                    unit: value
                                })
                            }}  
                            placeholder="请输入单位名称" />
                    </Form.Item>
                </Form>
            </Modal>
            <Drawer
                title={`【${attrValueListDrawerProps.attrKey.keyName}】的规格值列表`}
                destroyOnClose
                width={700}
                onClose={handleAttrValueListDrawerClose}
                visible={attrValueListDrawerProps.visible}
            >
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={(() => handleAttrValueModalOpen())}>
                        添加规格值
                    </Button>
                </Space>
                <Table
                    size="small"
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={attrValueListColumns}
                    rowKey={record => record.id}
                    dataSource={attrValueList}
                    pagination={false}
                />
                <Modal
                    destroyOnClose
                    title={attrValueModalProps.title}
                    visible={attrValueModalProps.visible}
                    onOk={handleAttrValueModalOk}
                    confirmLoading={attrValueModalLoading}
                    onCancel={handleAttrValueModalClose}
                >
                    <Form size="large">
                        <Form.Item
                            label="规格值"
                        >
                            <Input 
                                value={attrValueModalData.valueName} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setAttrValueModalData({
                                        ...attrValueModalData,
                                        valueName: value
                                    })
                                }}  
                                placeholder="请输入规格值" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Drawer>
        </div>
    )
}

export default Specifications