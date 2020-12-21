import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, message, Modal, Form, Input, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const borderRadius = { borderRadius: 4 }

const layout = {
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

const FrontPermit = () => {

    const [rootFrontPermit, setRootFrontPermit] = useState({})
    const [frontPermitList, setFrontPermitList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    useEffect(() => {
        getFrontPermitList()
    }, [])

    const getFrontPermitList = async () => {
        setTableLoading(true)

        let resp = await httpUtils.get('/front/permits')
        setRootFrontPermit(resp.tree)

        let wrap = wrapTableList(resp.children)
        setFrontPermitList(wrap)
        setTableLoading(false)
    }

    
    const wrapTableList = frontPermits => {
        let temp = []
        frontPermits.map(item => {
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
            title: '编号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '权限类别',
            dataIndex: 'permitType',
            align: 'center',
            render: permitType => permitType == 1 ? '一级菜单': permitType == 2 ? '二级菜单': '页面元素'
        },
        {
            title: '前端权限名称',
            dataIndex: 'frontName',
            align: 'center',
        },
        {
            title: '权限字段',
            dataIndex: 'classId',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleFrontPermitModalOpen({}, record)}>增加子权限</Typography.Link>
                    <Typography.Link onClick={() => handleFrontPermitModalOpen(record, {})}>编辑</Typography.Link>
                    {
                        !(record.children && record.children.length > 0) && 
                            <Popconfirm placement="topLeft" title="确定删除该权限吗?" onConfirm={() => deleteFrontPermit(record.id)} okText="确定" cancelText="取消">
                                <Typography.Link type="danger">删除</Typography.Link>
                            </Popconfirm>
                    }
                </Space>
            )
        }
    ]

    const [frontPermitModalProps, setFrontPermitModalProps] = useState({
        visible: false,
        title: '添加子权限',
        parentFrontPermit: {}
    })
    const [frontPermitModalData, setFrontPermitModalData] = useState({})
    const [frontPermitModalLoading, setFrontPermitModalLoading] = useState(false)

    const handleFrontPermitModalOpen = (data = {}, parentFrontPermit = {}) => {
        setFrontPermitModalProps({
            visible: true,
            title: data.id ? '更新子权限': '添加子权限',
            parentFrontPermit: data.id ? {} : (parentFrontPermit.id ? parentFrontPermit : rootFrontPermit)
        })
        setFrontPermitModalData(data)
    }
    const handleFrontPermitModalClose = () => {
        setFrontPermitModalProps({
            visible: false,
            title: '添加子权限',
            parentFrontPermit: {}
        })
        setFrontPermitModalData({})
        setFrontPermitModalLoading(false)
    }
    const handleFrontPermitModalOk = async () => {
        setFrontPermitModalLoading(true)
        if (frontPermitModalData.id) {
            let data = {
                id: frontPermitModalData.id,
                frontName: frontPermitModalData.frontName,
                classId: frontPermitModalData.classId,
            }
            await httpUtils.post('/front/permit/update', data)
        } else {
            let data = {
                pid: frontPermitModalProps.parentFrontPermit.id,
                systemType: frontPermitModalProps.parentFrontPermit.systemType,
                permitType: frontPermitModalProps.parentFrontPermit.permitType + 1,
                frontName: frontPermitModalData.frontName,
                classId: frontPermitModalData.classId,
            }
            await httpUtils.post('/front/permit/add', data)
        }
        message.success('操作完成')
        handleFrontPermitModalClose()
        getFrontPermitList()
    }

    const deleteFrontPermit = async frontPermitId => {
        await httpUtils.post(`/front/permit/del/${frontPermitId}`)
        message.success('删除成功')
        getFrontPermitList()
    }

    return (
        <div style={blockStyle}>
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleFrontPermitModalOpen()}>
                    添加
                </Button>
            </Space>
            <Table
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={frontPermitList}
                pagination={false}
                loading={tableLoading}
            />
            <Modal
                destroyOnClose
                title={frontPermitModalProps.title}
                visible={frontPermitModalProps.visible}
                onOk={handleFrontPermitModalOk}
                confirmLoading={frontPermitModalLoading}
                onCancel={handleFrontPermitModalClose}
            >
                <Form size="large" {...layout}>
                    {
                        !frontPermitModalData.id &&
                            <Form.Item
                                label="父级名称"
                            >
                                <Input 
                                    value={frontPermitModalProps.parentFrontPermit.frontName} 
                                    size="large" 
                                    disabled    
                                />
                            </Form.Item>
                    }
                    <Form.Item
                        label="子权限名称"
                    >
                        <Input 
                            value={frontPermitModalData.frontName} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setFrontPermitModalData({
                                    ...frontPermitModalData,
                                    frontName: value
                                })
                            }}  
                            placeholder="请输入子权限名称" />
                    </Form.Item>
                    <Form.Item
                        label="权限字段"
                    >
                        <Input 
                            value={frontPermitModalData.classId} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setFrontPermitModalData({
                                    ...frontPermitModalData,
                                    classId: value
                                })
                            }}  
                            placeholder="请输入权限字段" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default FrontPermit