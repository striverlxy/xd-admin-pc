import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Typography, Divider, message, Form, Modal } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const { Option } = Select;
const { RangePicker } = DatePicker;

const borderRadius = { borderRadius: 4 }
const inputStyle = { width: 160, borderRadius: 4 }
const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

const AdminUser = () => {

    const [adminUserList, setAdminUser] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const getAdminUserList = async () => {

    }

    useEffect(() => {
        getAdminUserList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '用户ID',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '登录账号',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '姓名',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '手机',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '角色',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '组织',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '账户状态',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleAdminUserModalOpen(record)}>编辑</Typography.Link>
                    <Typography.Link>设置角色</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link type="danger">停用/启用</Typography.Link>
                </Space>
            )
        }
    ]

    const [adminUserModalProps, setAdminUserModalProps] = useState({
        visible: false,
        title: '新增用户'
    })
    const [adminUserModalData, setAdminUserModalData] = useState({})
    const [adminUserModalLoading, setAdminUserModalLoading] = useState(false)
    
    const handleAdminUserModalOpen = (data = {}) => {
        setAdminUserModalProps({
            visible: true,
            title: data.id ? '更新用户': '新增用户'
        })
        setAdminUserModalData(data)
    }
    const handleAdminUserModalClose = () => {
        setAdminUserModalProps({
            visible: false,
            title: '新增用户'
        })
        setAdminUserModalData({})
        setAdminUserModalLoading(false)
    }
    const handleAdminUserModalOk = async () => {
        await httpUtils.post(adminUserModalData.id ? '/admin/store/update': '/internal/signUp', adminUserModalData)
        message.success('操作完成')
        handleAdminUserModalClose()
        getAdminUserList()
    }

    return (
        <div>
            <Card 
                size="small"
                title="数据检索" 
                extra={
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
                        placeholder="请输入序列号" 
                        allowClear 
                    />
                    <RangePicker size="middle" />
                </Space>
            </Card>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={handleAdminUserModalOpen}>
                        添加
                    </Button>
                </Space>
                <Table
                    size="small"
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={adminUserList}
                    pagination={{
                        total: 100
                    }}
                    loading={tableLoading}
                    // onChange={async (pagination, filters, sorter) => handleTableChange(pagination)}
                />
                <Modal
                    destroyOnClose
                    title={adminUserModalProps.title}
                    visible={adminUserModalProps.visible}
                    onOk={handleAdminUserModalOk}
                    confirmLoading={adminUserModalLoading}
                    onCancel={handleAdminUserModalClose}
                >
                    <Form size="large" {...layout}>
                        <Form.Item
                            label="用户名"
                        >
                            <Input 
                                value={adminUserModalData.username} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setAdminUserModalData({
                                        ...adminUserModalData,
                                        username: value
                                    })
                                }}  
                                placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item
                            label="邮箱"
                        >
                            <Input 
                                value={adminUserModalData.email} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setAdminUserModalData({
                                        ...adminUserModalData,
                                        email: value
                                    })
                                }}  
                                placeholder="请输入邮箱" />
                        </Form.Item>
                        <Form.Item
                            label="手机号码"
                        >
                            <Input 
                                value={adminUserModalData.phone} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setAdminUserModalData({
                                        ...adminUserModalData,
                                        phone: value
                                    })
                                }}  
                                placeholder="请输入手机号码" />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                        >
                            <Input 
                                value={adminUserModalData.password} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setAdminUserModalData({
                                        ...adminUserModalData,
                                        password: value
                                    })
                                }}  
                                placeholder="请输入密码" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default AdminUser