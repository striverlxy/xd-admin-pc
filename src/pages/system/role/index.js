import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, message, Modal, Form, Input, Drawer, Popconfirm, Tree } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'
import AreaSelect from '../../../components/areaSelect'

const borderRadius = { borderRadius: 4 }

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}

const Role = () => {

    const [roleList, setRoleList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const roleColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '角色名',
            dataIndex: 'roleName',
            align: 'center',
        },
        {
            title: '描述',
            dataIndex: 'note',
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
                    <Typography.Link onClick={() => handleRoleModalOpen(record)}>编辑</Typography.Link>
                    <Typography.Link onClick={() => handleFrontPermitModaOpen(record)}>分配前端权限</Typography.Link>
                    <Typography.Link>分配资源</Typography.Link>
                    <Popconfirm placement="topLeft" title="确定删除该角色吗?" onConfirm={() => deleteRole(record.id)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    useEffect(() => {
        getRoleList()
    }, [])
    const getRoleList = async () => {
        setTableLoading(true)
        let resp = await httpUtils.get('/role/list', {})
        setRoleList(resp)
        setTableLoading(false)
    }

    const [roleModalProps, setRoleModalProps] = useState({
        visible: false,
        title: '新增角色'
    })
    const [roleModalData, setRoleModalData] = useState({})
    const [roleModalLoading, setRoleModalLoading] = useState(false)

    const handleRoleModalOpen = (data = {}) => {
        setRoleModalProps({
            visible: true,
            title: data.id ? '更新角色': '新增角色'
        })
        setRoleModalData(data)
    }
    const handleRoleModalClose = () => {
        setRoleModalProps({
            visible: false,
            title: '新增角色'
        })
        setRoleModalData({})
        setRoleModalLoading(false)
    }
    const handleRoleModalOk = async () => {
        let data = {
            roleName: roleModalData.roleName,
            note: roleModalData.note,
            systemType: 0
        }
        if (roleModalData.id) {
            data.id = roleModalData.id
        }
        await httpUtils.post(data.id ? '/role/update': '/role/add', data)
        message.success('操作完成')
        handleRoleModalClose()
        getRoleList()
    }

    const deleteRole = async roleId => {
        await httpUtils.post(`/role/del/${roleId}`)
        message.success('操作完成')
        getRoleList()
    }

    const [frontPermitModalProps, setFrontPermitModalProps] = useState({
        visible: false,
        role: {}
    })
    const [frontPermitList, setFrontPermitList] = useState([])
    const handleFrontPermitModaOpen = role => {
        setFrontPermitModalProps({
            visible: true,
            role
        })
        getFrontPermitList()
        getRoleFrontPermit(role.id)
    }
    const getRoleFrontPermit = async roleId => {
        let resp = await httpUtils.get('/role/front/permits', {roleId: roleId})
        setFrontPermitList(resp.map(item => item.frontPermitId))
    }
    const handleFrontPermitModaClose = () => {
        setFrontPermitModalProps({
            visible: false,
            role: {}
        })
        setFrontPermitList([])
    }

    const [allfrontPermitTree, setAllfrontPermitTree] = useState([])

    const getFrontPermitList = async () => {
        let resp = await httpUtils.get('/front/permits')
        let wrap = wrapTableList(resp.children)
        console.log(wrap)
        setAllfrontPermitTree(wrap)
    }

    
    const wrapTableList = frontPermits => {
        let temp = []
        frontPermits.map(item => {
            let obj = {
                title: item.tree.frontName,
                key: item.tree.id,
                classId: item.tree.classId
            }

            if (item.children && item.children.length > 0) {
                obj.children = wrapTableList(item.children)
            }
            temp.push(obj)
        })

        return temp
    }

    
    const onCheck = async (checkedKeys, e) => {
        console.log('onCheck', e);
        let data = {
            roleId: frontPermitModalProps.role.id,
            systemType: frontPermitModalProps.role.systemType,
        }
        data.frontPermits = e.checkedNodes.map(item => {
            return {
                frontPermitId: item.key,
                classId: item.classId
            }
        })
        await httpUtils.post('/front/permit/role/bind', data)
        message.success('更新成功')
        setFrontPermitList(checkedKeys);
    };

    return (
        <div style={blockStyle}>
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={(() => handleRoleModalOpen())}>
                    新建角色
                </Button>
            </Space>
            <Table
                size="small"
                bordered={true}
                style={{marginTop: 12}}
                columns={roleColumns}
                rowKey={record => record.id}
                dataSource={roleList}
                pagination={false}
                loading={tableLoading}
            />
            <Modal
                destroyOnClose
                title={roleModalProps.title}
                visible={roleModalProps.visible}
                onOk={handleRoleModalOk}
                confirmLoading={roleModalLoading}
                onCancel={handleRoleModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="角色名称"
                    >
                        <Input 
                            value={roleModalData.roleName} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setRoleModalData({
                                    ...roleModalData,
                                    roleName: value
                                })
                            }}  
                            placeholder="请输入角色名称" />
                    </Form.Item>
                    <Form.Item
                        label="角色描述"
                    >
                        <Input 
                            value={roleModalData.note} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setRoleModalData({
                                    ...roleModalData,
                                    note: value
                                })
                            }}  
                            placeholder="请输入角色描述" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                width={400}
                destroyOnClose
                title={frontPermitModalProps.role.roleName + '的权限管理'}
                visible={frontPermitModalProps.visible}
                onCancel={handleFrontPermitModaClose}
                footer={false}
            >
                <Tree
                    checkable
                    // onExpand={onExpand}
                    // expandedKeys={expandedKeys}
                    onCheck={onCheck}
                    checkedKeys={frontPermitList}
                    // onSelect={onSelect}
                    // selectedKeys={[6] || frontPermitList.map(item => item.id)}
                    treeData={allfrontPermitTree}
                />
            </Modal>
        </div>
    )
}

export default Role