import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Space, Divider, Modal, Form, Input, message, Switch, Popconfirm, InputNumber} from 'antd';
import styles from './style.less'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const { Option } = Select;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
};

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

const formRules = {
    mobile: [
        {
          required: true,
          message: '请输入手机号码',
        },
        {
          pattern: /^1\d{10}$/,
          message: '手机号码格式有误',
        }
    ],
}

export default function Station() {

    const [storeList, setStoreList] = useState([])
    const [choosedStore, setChoosedStore] = useState({})
    const getStoreList = async () => {
        let resp = await httpUtils.get('/admin/store/list')
        setStoreList(resp)
        if (resp.length > 0) {
            setChoosedStore(resp[0])
        }
    }


    const [data, setData] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const getStationList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/site/page', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getStationList()
        getStoreList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '站点名称',
            dataIndex: 'siteName',
            align: 'center',
        },
        {
            title: '站点负责人',
            dataIndex: 'contactName',
            align: 'center',
        },
        {
            title: '联系方式',
            dataIndex: 'contactPhone',
            align: 'center',
        },
        {
            title: '站点地址',
            dataIndex: 'address',
            align: 'center',
        },
        {
            title: '配送半径（km）',
            dataIndex: 'serviceRadius',
            align: 'center',
        },
        {
            title: '自提时间',
            align: 'center',
            render: record => record.liftStartTime + "-" + record.liftEndTime
        },
        {
            title: '营业状态',
            align: 'center',
            render: record => <Switch checkedChildren="营业" unCheckedChildren="未营业" checked={record.busyStatus} onChange={() => handleSiteUpdateBusyStatus(record)} />
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 150,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Popconfirm placement="topLeft" title="确定删除该站点吗?" onConfirm={() => delSite(record.id)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                    <Typography.Link onClick={() => handleSiteModalOpen(record)}>编辑</Typography.Link>
                </Space>
            )
        }
    ];

    const [siteModalProps, setSiteModalProps] = useState({
        visible: false,
        title: '新增站点'
    })
    const [siteModalData, setSiteModalData] = useState({})
    const [siteModalLoading, setSiteModalLoading] = useState(false)
    
    const handleSiteModalOpen = (data = {}) => {
        setSiteModalProps({
            visible: true,
            title: data.id ? '更新站点': '新增站点'
        })
        setSiteModalData(data)
    }
    const handleSiteModalClose = () => {
        setSiteModalProps({
            visible: false,
            title: '新增站点'
        })
        setSiteModalData({})
        setSiteModalLoading(false)
    }
    const handleSiteModalOk = async () => {

        if (!siteModalData.contactPhone) {
            message.error('请输入手机号码')
            return
        }

        if (!/^1\d{10}$/.test(siteModalData.contactPhone)) {
            message.error('手机号码格式有误')
            return
        }

        await httpUtils.post(siteModalData.id ? '/admin/site/update': '/admin/site/add', siteModalData)
        message.success('操作完成')
        handleSiteModalClose()
        getStationList()
    }

    const handleSiteUpdateBusyStatus = async record => {
        let data = {
            id: record.id,
            busyStatus: record.busyStatus == 0 ? 1: 0
        }
        await httpUtils.post('/admin/site/update', data)
        message.success('操作完成')
        getStationList()
    }

    const delSite = async id => {
        await httpUtils.post(`/admin/site/del/${id}`, {})
        message.success('删除成功')
        getStationList()
    }

    const [form] = Form.useForm();

    const randerTable = () => {
        return (
            <div>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleSiteModalOpen()}>
                        添加
                    </Button>
                </Space>
                <Table
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data.dataList}
                    pagination={{
                        total: data.totalCount
                    }}
                    loading={tableLoading}
                    onChange={async (pagination, filters, sorter) => getStationList(pagination)}
                />
                <Modal
                    destroyOnClose
                    title={siteModalProps.title}
                    visible={siteModalProps.visible}
                    onOk={handleSiteModalOk}
                    confirmLoading={siteModalLoading}
                    onCancel={handleSiteModalClose}
                >
                    <Form size="large" {...layout}>
                        <Form.Item
                            label="站点名"
                        >
                            <Input 
                                value={siteModalData.siteName} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setSiteModalData({
                                        ...siteModalData,
                                        siteName: value
                                    })
                                }}  
                                placeholder="请输入组织名称" />
                        </Form.Item>
                        <Form.Item
                            label="集配仓"
                        >
                            <Select 
                                placeholder="请选择集配仓" 
                                style={{ width: 200 }} 
                                value={siteModalData.storeId} 
                                onChange={e =>{
                                    setSiteModalData({
                                        ...siteModalData,
                                        storeId: e
                                    })
                                }}>
                                {
                                    storeList.map((item, index) => (
                                        <Select.Option value={item.id} key={index}>{item.storeName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="站点负责人"
                        >
                            <Input 
                                value={siteModalData.contactName} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setSiteModalData({
                                        ...siteModalData,
                                        contactName: value
                                    })
                                }}  
                                placeholder="请输入站点负责人" />
                        </Form.Item>
                        <Form.Item
                            label="联系电话"
                        >
                            <Input
                                value={siteModalData.contactPhone} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setSiteModalData({
                                        ...siteModalData,
                                        contactPhone: value
                                    })
                                }}  
                                placeholder="请输入联系电话" />
                        </Form.Item>
                        <Form.Item
                            label="站点地址"
                        >
                            <Input 
                                value={siteModalData.address} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setSiteModalData({
                                        ...siteModalData,
                                        address: value
                                    })
                                }}  
                                placeholder="请输入站点地址" />
                        </Form.Item>
                        <Form.Item
                            label="配送半径(km)"
                        >
                            <InputNumber
                                value={siteModalData.serviceRadius} 
                                size="large" 
                                onChange={value => {
                                    setSiteModalData({
                                        ...siteModalData,
                                        serviceRadius: value
                                    })
                                }}  
                                placeholder="请输入配送半径" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
    
    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }} value={choosedStore.id} onChange={(e1, e2) => {
                        setChoosedStore({
                            id: e2.value,
                            storeName: e2.children
                        })
                    }}>
                        {
                            storeList.map((item, index) => (
                                <Select.Option value={item.id} key={index}>{item.storeName}</Select.Option>
                            ))
                        }
                    </Select>
                }
            >
                <TabPane tab="站点管理" key="1">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}