import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Space, Divider, Drawer, Card, Form, Input, List, Modal, message, Switch} from 'antd';
import styles from './style.less'
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const { Option } = Select;

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

export default function RouteManage() {

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

    const getRouteList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/route/list', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getRouteList()
        getStoreList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '路线名称',
            dataIndex: 'routeName',
            align: 'center',
        },
        {
            title: '站点',
            dataIndex: 'siteCount',
            align: 'center',
        },
        {
            title: '路线状态',
            align: 'center',
            render: record => <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultValue={record.isOpen} onChange={e => oplRouteOpenStatus(record)} />
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleRouteDrawerOpen(record)}>添加站点</Typography.Link>
                    <Typography.Link>编辑</Typography.Link>
                    {
                        record.isDel ? <Typography.Link type="success">恢复</Typography.Link>: <Typography.Link type="danger" onClick={() => delRoute(record.id)}>删除</Typography.Link>
                    }
                </Space>
            )
        }
    ];


    const [siteList, setSiteList] = useState([])
    const getSiteList = async ()=> {
        let resp = await httpUtils.get('/admin/site/list')
        setSiteList(resp)
    }

    const [routeDrawerProps, setRouteDrawerProps] = useState({
        visible: false,
        title: '编辑线路',
        route: {}
    })
    const handleRouteDrawerOpen = route => {
        setRouteDrawerProps({
            visible: true,
            title: '编辑线路',
            route
        })
        getSiteList()
        getRouteSiteList(route.id)
    }
    const handleRouteDrawerClose = () => {
        setRouteDrawerProps({
            visible: false,
            title: '编辑线路',
            route: {}
        })
    }

    const [routeModalProps, setRouteModalProps] = useState({
        visible: false,
        title: '新增路线'
    })
    const [routeModalData, setRouteModalData] = useState({})
    const [routeModalLoading, setRouteModalLoading] = useState(false)
    
    const handleRouteModalOpen = (data = {}) => {
        setRouteModalProps({
            visible: true,
            title: data.id ? '更新路线': '新增路线'
        })
        setRouteModalData(data)
    }
    const handleRouteModalClose = () => {
        setRouteModalProps({
            visible: false,
            title: '新增路线'
        })
        setRouteModalData({})
        setRouteModalLoading(false)
    }
    const handleRouteModalOk = async () => {
        await httpUtils.post(routeModalData.id ? '/admin/route/update': '/admin/route/add', routeModalData)
        message.success('操作完成')
        handleRouteModalClose()
        getRouteList()
    }
    const oplRouteOpenStatus = async (route) => {
        let isOpen = route.isOpen
        await httpUtils.post(isOpen ? '/admin/route/route/close': '/admin/route/route/open', {routeId: route.id})
        message.success('更新完成')
        getRouteList()
    }
    const delRoute = async routeId => {
        await httpUtils.post(`/admin/route/route/del/${routeId}`, {})
        message.success('删除成功')
        getRouteList()
    }

    const [selectedSite, setSelectedSite] = useState('')
    const [routeSiteList, setRouteSiteList] = useState([])
    const arrangeSite = async () => {
        let data = {
            routeId: routeDrawerProps.route.id,
            siteId: selectedSite,
            storeId: routeDrawerProps.route.storeId
        }
        await httpUtils.post('/admin/route/arrange/site', data)
        message.success('添加成功')
        getRouteSiteList(routeDrawerProps.route.id)
    }
    const getRouteSiteList = async routeId => {
        let param = {
            routeId: routeId
        }
        let resp = await httpUtils.get('/admin/site/list', param)
        setRouteSiteList(resp)
    }

    const movePosition = async (up, down) => {
        let data = {
            upSiteId: routeSiteList[up].id,
            downSiteId: routeSiteList[down].id,
        }
        await httpUtils.post('/admin/route/site/priority/update', data)
        message.success('调整成功')
        getRouteSiteList(routeDrawerProps.route.id)
    }

    const removeRouteSite = async index => {
        let data = {
            id: routeSiteList[index].id,
            routeId: 0,
            routeName: ''
        }
        await httpUtils.post('/admin/site/update', data)
        message.success('删除成功')
        getRouteSiteList(routeDrawerProps.route.id)
    }

    const randerTable = () => {
        return (
            <div>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleRouteModalOpen()}>
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
                    onChange={async (pagination, filters, sorter) => getRouteList(pagination)}
                />
                <Modal
                    destroyOnClose
                    title={routeModalProps.title}
                    visible={routeModalProps.visible}
                    onOk={handleRouteModalOk}
                    confirmLoading={routeModalLoading}
                    onCancel={handleRouteModalClose}
                >
                    <Form>
                        <Form.Item
                            label="路线名"
                        >
                            <Input 
                                value={routeModalData.routeName}
                                width={200} 
                                placeholder="请输入路线名" 
                                onChange={e => {
                                    const { value } = e.target
                                    setRouteModalData({
                                        ...routeModalData,
                                        routeName: value
                                    })
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="集配仓"
                        >
                            <Select 
                                placeholder="请选择集配仓" 
                                style={{ width: 200 }} 
                                value={routeModalData.storeId} 
                                onChange={e => {
                                    setRouteModalData({
                                        ...routeModalData,
                                        storeId: e
                                    })
                                }}
                            >
                                {
                                    storeList.map((item, index) => (
                                        <Select.Option value={item.id}>{item.storeName}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Drawer
                    title={routeDrawerProps.title}
                    destroyOnClose
                    width={500}
                    onClose={handleRouteDrawerClose}
                    visible={routeDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Card 
                        size="small" 
                        style={{marginTop: 20}} 
                        title="站点路线"
                        extra={
                            <Space>
                                <Select style={{width: 150}} placeholder="请选择站点" onChange={e => setSelectedSite(e)}>
                                    {
                                        siteList.map((item, index) => (
                                            <Select.Option value={item.id} key={index}>{item.siteName}</Select.Option>
                                        ))
                                    }
                                </Select>
                                <Button type="primary" onClick={() => arrangeSite()}>添加</Button>
                            </Space>
                        }
                    >
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={routeSiteList}
                            footer={<div></div>}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[
                                            <div>
                                                {index == 0 ? null : <ArrowUpOutlined className={styles.edit_icon} onClick={() => movePosition(index - 1, index)} />}
                                                {index == (routeSiteList.length - 1) ? null : <ArrowDownOutlined className={styles.edit_icon} onClick={() => movePosition(index, index + 1)} />}
                                            </div>,
                                            <DeleteOutlined className={styles.delete_icon} onClick={() => removeRouteSite(index)} />
                                    ]}
                                >
                                    {item.siteName}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Drawer>
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
                <TabPane tab="线路管理" key="1">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}