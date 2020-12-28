import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Typography, Divider, message, Form, Modal, Switch, Radio } from 'antd';
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

    const getAdminUserList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/internal/user/list', params)
        setAdminUser(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getAdminUserList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center'
        },
        {
            title: '用户ID',
            dataIndex: 'internalNo',
            align: 'center'
        },
        {
            title: '姓名',
            dataIndex: 'username',
            align: 'center'
        },
        {
            title: '手机',
            dataIndex: 'phone',
            align: 'center'
        },
        {
            title: '角色',
            dataIndex: 'roles',
            align: 'center',
            render: roles => {
                if (roles) {
                    roles = JSON.parse(roles)
                    return roles.length > 0 && roles.map(item => item.role_name).join('、')
                }
            }
        },
        {
            title: '组织',
            dataIndex: 'storeName',
            align: 'center'
        },
        {
            title: '账户状态',
            align: 'center',
            render: record => <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={record.isDisabled} />
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleUserRoleModalOpen(record)}>设置角色</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                </Space>
            )
        }
    ]

    const [storeList, setStoreList] = useState([])
    const [choosedStore, setChoosedStore] = useState({})
    const getStoreList = async () => {
        let resp = await httpUtils.get('/admin/store/list')
        setStoreList(resp)
    }

    const [adminUserModalProps, setAdminUserModalProps] = useState({
        visible: false,
        title: '新增用户'
    })
    const [adminUserModalData, setAdminUserModalData] = useState({})
    const [adminUserModalLoading, setAdminUserModalLoading] = useState(false)
    
    const handleAdminUserModalOpen = (data = {}) => {
        setAdminUserModalProps({
            visible: true,
            title: data.id ? '用户基本信息': '新增用户'
        })
        setAdminUserModalData(data)
        getStoreList()
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
        if (!adminUserModalData.id) {
            adminUserModalData.systemId = 0
        }
        await httpUtils.post('/internal/signUp', adminUserModalData)
        message.success('添加成功')
        handleAdminUserModalClose()
        getAdminUserList()
    }


    const [roleList, setRoleList] = useState([])
    const getRoleList = async () => {
        let resp = await httpUtils.get('/role/list', {})
        setRoleList(resp)
    }

    const [userRoleModalProps, setUserRoleModalProps] = useState({
        visible: false,
        userAdmin: {}
    })
    const [userRoleModalData, setUserRoleModalData] = useState({})
    const [userRoleModalLoading, setUserRoleModalLoading] = useState(false)

    const handleUserRoleModalOpen = userAdmin => {
        setUserRoleModalProps({
            visible: true
        })
        
        let roleIds = JSON.parse(userAdmin.roles).map(item => item.role_id)
        let tmpUser = {
            id: userAdmin.id,
            roleIds
        }
        setUserRoleModalData(tmpUser)
        getRoleList()
    }
    const handleUserRoleModalClose = () => {
        setUserRoleModalProps({
            visible: false
        })
        setUserRoleModalData({})
        setUserRoleModalLoading(false)
    }
    const handleUserRoleModalOk = async () => {
        let data = {
            systemType: 0,
            userId: userRoleModalData.id,
            roleIds: userRoleModalData.roleIds
        }
        await httpUtils.post('/internal/role/bind', data)
        message.success('操作完成')
        handleUserRoleModalClose()
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
                    dataSource={adminUserList.dataList}
                    pagination={{
                        total: adminUserList.totalCount
                    }}
                    loading={tableLoading}
                    onChange={async (pagination, filters, sorter) => getAdminUserList(pagination)}
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
                        <Form.Item
                            label="用户类别"
                        >
                            <Radio.Group 
                                value={adminUserModalData.level} 
                                onChange={e => {
                                    setAdminUserModalData({
                                        ...adminUserModalData,
                                        level: e.target.value
                                    })
                                }}
                            >
                                <Radio.Button value="0">运营方</Radio.Button>
                                <Radio.Button value="1">集配仓</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {
                            adminUserModalData.level == 0 &&
                                <Form.Item
                                    label="所属集配仓"
                                >
                                    <Select 
                                        placeholder="请选择集配仓" 
                                        style={{ width: 200 }} 
                                        value={adminUserModalData.storeId} 
                                        onChange={(e1, e2) => {
                                            setAdminUserModalData({
                                                ...adminUserModalData,
                                                storeId: e1
                                            })
                                        }}
                                    >
                                        {
                                            storeList.map((item, index) => (
                                                <Select.Option value={item.id} key={index}>{item.storeName}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                        }
                    </Form>
                </Modal>
                <Modal
                    destroyOnClose
                    title={userRoleModalProps.title}
                    visible={userRoleModalProps.visible}
                    onOk={handleUserRoleModalOk}
                    confirmLoading={userRoleModalLoading}
                    onCancel={handleUserRoleModalClose}
                >
                    <Form size="large">
                        <Form.Item
                            label="用户角色"
                        >
                            <Select
                                mode="multiple"
                                placeholder="请选择用户角色" 
                                style={{ width: 200 }} 
                                value={userRoleModalData.roleIds || []} 
                                onChange={(e1, e2) => {
                                    setUserRoleModalData({
                                        ...userRoleModalData,
                                        roleIds: e1
                                    })
                                }}
                            >
                                {
                                    roleList.map((item, index) => (
                                        <Select.Option value={item.id} key={index}>{item.roleName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default AdminUser