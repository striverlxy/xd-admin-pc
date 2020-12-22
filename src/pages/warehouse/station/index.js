import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Space, Divider, Modal, Form, Input, message, Switch} from 'antd';
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
            dataIndex: 'name',
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
            render: record => <Switch checkedChildren="营业" unCheckedChildren="未营业" defaultValue={record.busyStatus == 0 ? false : true} />
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link type="danger">删除</Typography.Link>
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
        await httpUtils.post(siteModalData.id ? '/admin/site/update': '/admin/site/add', siteModalData)
        message.success('操作完成')
        handleSiteModalClose()
        getStationList()
    }

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
                                        <Select.Option value={item.id}>{item.storeName}</Select.Option>
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
                            <Input 
                                value={siteModalData.serviceDistance} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setSiteModalData({
                                        ...siteModalData,
                                        serviceDistance: value
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
                    <Select placeholder="请选择集配仓" style={{ width: 200 }} value={choosedStore.id}>
                        {
                            storeList.map((item, index) => (
                                <Select.Option value={item.id}>{item.storeName}</Select.Option>
                            ))
                        }
                    </Select>
                }
            >
                <TabPane tab="全部站点" key="1">
                    {randerTable()}
                </TabPane>
                <TabPane tab="未营业站点" key="2">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}