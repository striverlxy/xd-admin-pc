import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, message, Modal, Form, Input, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const borderRadius = { borderRadius: 4 }

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const Category = () => {

    const [rootCate, setRootCate] = useState({})
    const [categotyList, setCategoryList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    useEffect(() => {
        getCateList()
    }, [])

    const getCateList = async () => {
        setTableLoading(true)

        let resp = await httpUtils.get('/admin/cate/list')
        setRootCate(resp.tree)

        let wrap = wrapTableList(resp.children)
        setCategoryList(wrap)
        setTableLoading(false)
    }

    
    const wrapTableList = cates => {
        let temp = []
        cates.map(item => {
            let obj = item.tree
            if (item.children && item.children.length > 0) {
                obj.children = wrapTableList(item.children)
            }
            temp.push(obj)
        })

        return temp
    }

    const columns = [
        {
            title: '分类名',
            dataIndex: 'cateName',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleCateModalOpen({}, record)}>增加子类</Typography.Link>
                    <Typography.Link onClick={() => handleCateModalOpen(record, {})}>编辑</Typography.Link>
                    {
                        !(record.children && record.children.length > 0) && 
                            <Popconfirm placement="topLeft" title="确定删除该分类吗?" onConfirm={() => deleteCate(record.id)} okText="确定" cancelText="取消">
                                <Typography.Link type="danger">删除</Typography.Link>
                            </Popconfirm>
                    }
                </Space>
            )
        }
    ]

    const [cateModalProps, setCateModalProps] = useState({
        visible: false,
        title: '添加子类',
        parentCate: {}
    })
    const [cateModalData, setCateModalData] = useState({})
    const [cateModalLoading, setCateModalLoading] = useState(false)

    const handleCateModalOpen = (data = {}, parentCate = {}) => {
        setCateModalProps({
            visible: true,
            title: data.id ? '更新子类': '添加子类',
            parentCate: data.id ? {} : (parentCate ? parentCate : rootCate)
        })
        setCateModalData(data)
    }
    const handleCateModalClose = () => {
        setCateModalProps({
            visible: false,
            title: '添加子类',
            parentCate: {}
        })
        setCateModalData({})
        setCateModalLoading(false)
    }
    const handleCateModalOk = async () => {
        setCateModalLoading(true)
        if (cateModalData.id) {
            let data = {
                id: cateModalData.id,
                pid: cateModalData.pid,
                cateName: cateModalData.cateName
            }
            await httpUtils.post('/admin/cate/update', data)
        } else {
            let data = {
                pid: cateModalProps.parentCate.id,
                cateName: cateModalData.cateName
            }
            await httpUtils.post('/admin/cate/add', data)
        }
        message.success('操作完成')
        handleCateModalClose()
        getCateList()
    }

    const deleteCate = async cateId => {
        await httpUtils.post(`/admin/cate/del/${cateId}`)
        message.success('删除成功')
        getCateList()
    }

    return (
        <div style={blockStyle}>
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleCateModalOpen()}>
                    添加
                </Button>
            </Space>
            <Table
                showHeader={false}	
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={categotyList}
                pagination={false}
                loading={tableLoading}
            />
            <Modal
                destroyOnClose
                title={cateModalProps.title}
                visible={cateModalProps.visible}
                onOk={handleCateModalOk}
                confirmLoading={cateModalLoading}
                onCancel={handleCateModalClose}
            >
                <Form size="large">
                    {
                        !cateModalData.id &&
                            <Form.Item
                                label="父级名称"
                            >
                                <Input 
                                    value={cateModalProps.parentCate.cateName} 
                                    size="large" 
                                    disabled    
                                />
                            </Form.Item>
                    }
                    <Form.Item
                        label="子类名称"
                    >
                        <Input 
                            value={cateModalData.cateName} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setCateModalData({
                                    ...cateModalData,
                                    cateName: value
                                })
                            }}  
                            placeholder="请输入子类名称" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Category