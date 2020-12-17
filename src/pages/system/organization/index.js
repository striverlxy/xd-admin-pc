import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, message, Modal, Form, Input, Drawer, Popconfirm } from 'antd'
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

const Organization = () => {

    const [organizationList, setOrganizationList] = useState({})
    const [tableLoading, setTableLoading] = useState(false)
    const organizationColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '组织名',
            dataIndex: 'storeName',
            align: 'center',
        },
        {
            title: '所处城市',
            align: 'center',
            render: record => record.provinceName + record.cityName + record.countyName
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
                    <Typography.Link onClick={() => handleOrganizationModalOpen(record)}>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link type="danger">启用/停用</Typography.Link>
                </Space>
            )
        }
    ]

    useEffect(() => {
        getOrganizationList()
    }, [])
    const getOrganizationList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/store/page', params)
        setOrganizationList(resp)
        setTableLoading(false)
    }

    const [organizationModalProps, setOrganizationModalProps] = useState({
        visible: false,
        title: '新增组织'
    })
    const [organizationModalData, setOrganizationModalData] = useState({})
    const [organizationModalLoading, setOrganizationModalLoading] = useState(false)

    const handleOrganizationModalOpen = (data = {}) => {
        setOrganizationModalProps({
            visible: true,
            title: data.id ? '更新组织': '新增组织'
        })
        setOrganizationModalData(data)
    }
    const handleOrganizationModalClose = () => {
        setOrganizationModalProps({
            visible: false,
            title: '新增组织'
        })
        setOrganizationModalData({})
        setOrganizationModalLoading(false)
    }
    const handleOrganizationModalOk = async () => {
        await httpUtils.post(organizationModalData.id ? '/admin/store/update': '/admin/store/add', organizationModalData)
        message.success('操作完成')
        handleOrganizationModalClose()
        getOrganizationList()
    }

    const saveArea = areaList => {
        let area = {}
        for (let i = 0; i < areaList.length; i++) {
            area[`${areaList[i].labelType}Name`] = areaList[i].label
            area[`${areaList[i].labelType}Code`] = areaList[i].value
        }
        setOrganizationModalData({
            ...organizationModalData,
            ...area
        })
    }

    return (
        <div style={blockStyle}>
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={(() => handleOrganizationModalOpen())}>
                    新建组织（集配仓）
                </Button>
            </Space>
            <Table
                size="small"
                bordered={true}
                style={{marginTop: 12}}
                columns={organizationColumns}
                rowKey={record => record.id}
                dataSource={organizationList.dataList}
                pagination={{
                    total: organizationList.totalCount
                }}
                loading={tableLoading}
                onChange={async (pagination, filters, sorter) => getOrganizationList(pagination)}
            />
            <Modal
                destroyOnClose
                title={organizationModalProps.title}
                visible={organizationModalProps.visible}
                onOk={handleOrganizationModalOk}
                confirmLoading={organizationModalLoading}
                onCancel={handleOrganizationModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="组织名称"
                    >
                        <Input 
                            value={organizationModalData.storeName} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setOrganizationModalData({
                                    ...organizationModalData,
                                    storeName: value
                                })
                            }}  
                            placeholder="请输入组织名称" />
                    </Form.Item>
                    <Form.Item
                        label="请选择所属区域"
                    >
                        <AreaSelect saveArea={saveArea} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Organization