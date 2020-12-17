import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Divider, Typography, Drawer, Descriptions, Image, message } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
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


const FarmerList = () => {

    const [farmerList, setFarmerList] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getFarmerList()
    }, [])

    const getFarmerList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setLoading(true)
        let resp = await httpUtils.get('/admin/farm/list', params)
        setFarmerList(resp)
        setLoading(false)
    }   

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '农户姓名',
            dataIndex: 'farmName',
            align: 'center',
        },
        {
            title: '类别',
            dataIndex: 'farmType',
            align: 'center',
            render: farmType =>  farmType == 1 ? '个人': '企业'
        },
        {
            title: '联系人',
            dataIndex: 'contactName',
            align: 'center',
        },
        {
            title: '地址',
            align: 'center',
            render: record => (record.provinceName || '') + (record.cityName || '') + (record.countyName || '') + (record.address || '')
        },
        {
            title: '手机号码',
            dataIndex: 'contactPhone',
            align: 'center',
        },
        {
            title: '合作状态',
            dataIndex: 'authStatus',
            align: 'center',
            render: authStatus => {
                if (authStatus == 1) {
                    return '待审核'
                } else if (authStatus == 2) {
                    return '合作中'
                } else if (authStatus == 3) {
                    return '暂停合作'
                } else if (authStatus == 4) {
                    return '审核未通过'
                } else {
                    return ''
                }
            }
        },
        {
            title: '微信认证',
            dataIndex: 'wechatAuthStatus',
            align: 'center',
            render: wechatAuthStatus => wechatAuthStatus == 1 ? '未认证': '已认证'
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space split={<Divider type="vertical" />}>
                    {
                        (record.authStatus == 1 || record.authStatus == 4) && <Typography.Link onClick={() => handleFarmerDetailDrawerOpen(record)}>去审核</Typography.Link>
                    }
                    {
                        record.authStatus == 2 && <Typography.Link type="danger" onClick={() => pause(record.id)}>暂停合作</Typography.Link>
                    }
                    {
                        record.authStatus == 3 && <Typography.Link onClick={() => goOn(record.id)}>继续合作</Typography.Link>
                    }
                    <Typography.Link onClick={() => handleFarmerDetailDrawerOpen(record)}>详情</Typography.Link>
                </Space>
            )
        }
    ];

    const [farmerDetailDrawerProps, setFarmerDetailDrawerProps] = useState({
        visible: false,
        title: '',
    })
    const [farmerDetailDrawerData, setFarmerDetailDrawerData] = useState({})
    const [farmerDetailDrawerApplyLoading, setFarmerDetailDrawerApplyLoading] = useState(false)
    const [farmerDetailDrawerRefuseLoading, setFarmerDetailDrawerRefuseLoading] = useState(false)
    const handleFarmerDetailDrawerOpen = data => {
        setFarmerDetailDrawerProps({
            visible: true,
            title: ''
        })
        setFarmerDetailDrawerData(data)
    }
    const handleFarmerDetailDrawerClose = () => {
        setFarmerDetailDrawerProps({
            visible: false,
            title: ''
        })
        setFarmerDetailDrawerData({})
        setFarmerDetailDrawerApplyLoading(false)
        setFarmerDetailDrawerRefuseLoading(false)
    }

    //审核通过
    const handleFarmerDetailDrawerApply = async () => {
        let data = {
            farmId: farmerDetailDrawerData.id,
            authStatus: 2
        }
        setFarmerDetailDrawerApplyLoading(true)
        await httpUtils.post('/admin/farm/auth/update', data)
        message.success('操作成功')
        handleFarmerDetailDrawerClose()
        getFarmerList()
    }

    //继续合作
    const goOn = async id => {
        let data = {
            farmId: id,
            authStatus: 2
        }
        await httpUtils.post('/admin/farm/auth/update', data)
        message.success('操作成功')
        getFarmerList()
    }

    //暂停合作
    const pause = async id => {
        let data = {
            farmId: id,
            authStatus: 3
        }
        await httpUtils.post('/admin/farm/auth/update', data)
        message.success('操作成功')
        getFarmerList()
    }

    //拒绝通过
    const handleFarmerDetailDrawerRefuse = async () => {
        let data = {
            farmId: farmerDetailDrawerData.id,
            authStatus: 4
        }
        setFarmerDetailDrawerRefuseLoading(true)
        await httpUtils.post('/admin/farm/auth/update', data)
        message.success('操作成功')
        handleFarmerDetailDrawerClose()
        getFarmerList()
    }

    return (
        <div>
            <div style={blockStyle}>
                <Table
                    size="small"
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={farmerList.dataList}
                    pagination={{
                        total: farmerList.totalCount
                    }}
                    loading={loading}
                    onChange={async (pagination, filters, sorter) => getFarmerList(pagination)}
                />
                <Drawer
                    title={farmerDetailDrawerProps.title + "的农户资料"}
                    destroyOnClose
                    width={720}
                    onClose={handleFarmerDetailDrawerClose}
                    visible={farmerDetailDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={handleFarmerDetailDrawerApply} oading={farmerDetailDrawerApplyLoading} type="primary" style={{ marginRight: 8 }}>
                                审批通过
                            </Button>
                            <Button onClick={handleFarmerDetailDrawerRefuse} loading={farmerDetailDrawerRefuseLoading} type="primary" danger>
                                拒绝通过
                            </Button>
                        </div>
                    }
                >
                    <Descriptions bordered size="small">
                        <Descriptions.Item label="类别" span={3}>{farmerDetailDrawerData.farmType == 1 ? '个人' : '企业'}</Descriptions.Item>
                        <Descriptions.Item label="农场/供应商名称" span={3}>{farmerDetailDrawerData.farmName}</Descriptions.Item>
                        <Descriptions.Item label="农场管理员手机号" span={3}>{farmerDetailDrawerData.contactPhone}</Descriptions.Item>
                        <Descriptions.Item label="身份证号" span={3}>{farmerDetailDrawerData.farmName}</Descriptions.Item>
                        <Descriptions.Item label="土地测量面积" span={3}>{farmerDetailDrawerData.square}</Descriptions.Item>
                        <Descriptions.Item label="土地测量面积图片" span={3}>
                            {
                                farmerDetailDrawerData.farmPics && farmerDetailDrawerData.farmPics.map((item, index) => (
                                    <Image width={160} key={index} src={item} />
                                ))
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </div>
        </div>
    )
}

export default FarmerList