import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Descriptions, Select, Card, Space, Input, Checkbox, Divider, Typography, message, Steps, Radio} from 'antd';
import styles from './style.less'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'
import Modal from 'antd/lib/modal/Modal';

const { Step } = Steps;

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

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
}

export default function Outbound() {

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

    const getOutboundList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/outboundOrder/page', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getStoreList()
        getOutboundList()
    }, [])


    const printOutbound = () => {
        window.document.body.innerHTML = window.document.getElementById('printArea').innerHTML;  
        window.print(); 
        window.location.reload();
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '集配单单号',
            dataIndex: 'outboundOrderNo',
            align: 'center',
        },
        {
            title: '出库日期',
            dataIndex: 'outboundTime',
            align: 'center',
        },
        {
            title: '路线',
            dataIndex: 'routeName',
            align: 'center',
        },
        {
            title: '司机',
            dataIndex: 'driverName',
            align: 'center',
        },
        {
            title: '车辆',
            dataIndex: 'vansNumber',
            align: 'center',
        },
        {
            title: '出库（制单）人',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '出库（制单）时间',
            dataIndex: 'outboundTime',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'outboundStatus',
            align: 'center',
            render: outboundStatus => outboundStatus == 0 ? '未装车' : outboundStatus == 1 ? '已装车': outboundStatus == 2 ? '已作废': ''
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 200,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => printOutbound()}>打印</Typography.Link>
                    {
                        record.outboundStatus != 2 && <Typography.Link type="danger" onClick={() => dropOutbound(record.id)}>作废</Typography.Link>
                    }
                    <Typography.Link onClick={() => handleOutboundDetailModalOpen(record)}>详情</Typography.Link>
                </Space>
            )
        }
    ];


    const [outboundModalProps, setOutboundModalProps] = useState({
        visible: false,
    })
    const [outboundModalData, setOutboundModalData] = useState({
        routeId: '',
        routeName: '',
        sites: [],
        storeId: choosedStore.id,
        storeName: choosedStore.storeName,
        packageOrderNos: [],
        driverName: '',
        driverId: '',
        vansNumber: '',
        vansId: ''
    })
    const [outboundModalLoading, setOutboundModalLoading] = useState(false)

    const [modalStep, setModalStep] = useState(0)
    
    const handleOutboundModalOpen = () => {
        setOutboundModalProps({
            visible: true,
        })
        getRouteList()
        getPackageOrderList()
        getDriverList()
        getVansList()
    }
    const handleOutboundModalClose = () => {
        setOutboundModalProps({
            visible: false,
        })
        setOutboundModalData({
            routeId: '',
            routeName: '',
            sites: [],
            storeId: choosedStore.id,
            storeName: choosedStore.storeName,
            packageOrderNos: [],
            driverName: '',
            driverId: '',
            vansNumber: '',
            vansId: ''
        })
        setOutboundModalLoading(false)
    }

    const [routeList, setRouteList] = useState([])
    const getRouteList = async () => {
        let params = {
            pageNum: 1,
            pageSize: 10000,
            storeId: choosedStore.id
        }
        let resp = await httpUtils.get('/admin/route/list', params)
        setRouteList(resp.dataList)
    }

    const getStepTitle = () => {
        if (modalStep == 0) {
            return '选择路线'
        } else if (modalStep == 1) {
            return '选择站点'
        } else if (modalStep == 2) {
            return '选择订单'
        } else if (modalStep == 3) {
            return '选择司机'
        } else if (modalStep == 4) {
            return '选择车辆'
        } else if (modalStep == 5) {
            return '信息确认'
        }
    }

    const choosedRoute = e => {
        let routeId = e.target.value
        let index = routeList.findIndex(route => route.id == routeId)
        if (index > -1) {
            setOutboundModalData({
                routeId: routeId,
                routeName: routeList[index].routeName,
                sites: [],
                storeId: choosedStore.id,
                storeName: choosedStore.storeName,
                packageOrderNos: [],
                driverName: '',
                driverId: '',
                vansNumber: '',
                vansId: ''
            })
            getSiteList(routeId)
        }
    }

    const [siteList, setSiteList] = useState([])
    const getSiteList = async routeId => {
        let resp = await httpUtils.get('/admin/site/list', {routeId: routeId})
        setSiteList(resp)
    }

    const chooseSites = siteIdList => {
        setOutboundModalData({
            ...outboundModalData,
            sites: siteIdList.map(id => {
                let index = siteList.findIndex(site => site.id == id)
                return {
                    siteId: siteList[index].id,
                    siteName: siteList[index].siteName
                }
            })
        })
    }

    const [packageOrderList, setPackageOrderList] = useState([])
    const getPackageOrderList = async () => {
        let params = {
            pageNum: 1,
            pageSize: 10000
        }
        let resp = await httpUtils.get('/admin/sorting/list', params)
        setPackageOrderList(resp.dataList)
    }
    const choosePackageOrder = orderIdList => {
        setOutboundModalData({
            ...outboundModalData,
            packageOrderNos: orderIdList
        })
    }

    const [driverList, setDriverList] = useState([])
    const getDriverList = async () => {
        let params = {
            pageNum: 1,
            pageSize: 10000,
            storeId: choosedStore.id
        }
        let resp = await httpUtils.get('/admin/driver/page', params)
        setDriverList(resp.dataList)
    }
    const choosedDriver = e => {
        let index = driverList.findIndex(driver => driver.id == e.target.value)
        if (index > -1) {
            setOutboundModalData({
                ...outboundModalData,
                driverName: driverList[index].driverName,
                driverId: driverList[index].id,
            })
        }
    }

    const [vansList, setVansList] = useState([])
    const getVansList = async () => {
        let params = {
            pageNum: 1,
            pageSize: 10000,
            storeId: choosedStore.id
        }
        let resp = await httpUtils.get('/admin/vans/page', params)
        setVansList(resp.dataList)
    }
    const chooseVans = e => {
        let index = vansList.findIndex(vans => vans.id == e.target.value)
        if (index > -1) {
            setOutboundModalData({
                ...outboundModalData,
                vansNumber: vansList[index].vansNumber,
                vansId: vansList[index].id
            })
        }
    }
    
    const submitOutbound = async () => {
        setOutboundModalLoading(true)
        await httpUtils.post('/admin/outboundOrder/add', outboundModalData)
        message.success('出库单创建成功')
        getOutboundList()
        handleOutboundModalClose()
    }

    const dropOutbound = async id => {
        await httpUtils.post(`/admin/outboundOrder/drop/${id}`, {})
        message.success('已作废')
        getOutboundList()
    }

    const [outboundDetailModalProps, setOutboundDetailModalProps] = useState({
        visible: false
    })
    const [outboundDetailModalData, setOutboundDetailModalData] = useState({})

    const handleOutboundDetailModalOpen = data => {
        setOutboundDetailModalProps({
            visible: true
        })
        setOutboundDetailModalData(data)
    }
    const handleOutboundDetailModalClose = () => {
        setOutboundDetailModalProps({
            visible: false
        })
        setOutboundDetailModalData({})
    }

    const randerTableComponents = () => {
        return (
            <div>
                <Card size="small"  title="数据检索" extra={
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
                            placeholder="出库单ID" 
                            allowClear 
                        />
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择司机"
                            allowClear 
                        >
                            <Option value="1">农户1</Option>
                            <Option value="2">农户2</Option>
                        </Select>
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择路线"
                            allowClear 
                        >
                            <Option value="1">农户1</Option>
                            <Option value="2">农户2</Option>
                        </Select>
                    </Space>
                </Card>
                {/* {renderOutBoundCard()} */}
                <div style={blockStyle}>
                    <Space>
                        <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleOutboundModalOpen()}>
                            创建出库单
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
                        onChange={async (pagination, filters, sorter) => getOutboundList(pagination)}
                    />
                    <Modal
                        width={700}
                        destroyOnClose
                        title="创建出库单"
                        visible={outboundModalProps.visible}
                        onCancel={handleOutboundModalClose}
                        footer={false}
                    >
                        <Space style={{width: '100%'}}>
                            <Steps direction="vertical" size="small" current={modalStep}>
                                <Step title="选择路线" />
                                <Step title="选择站点" description="送货顺序，从上至下" />
                                <Step title="选择订单" />
                                <Step title="选择司机" />
                                <Step title="选择车辆" />
                                <Step title="信息确认" />
                            </Steps>
                            <Card
                                className={styles.card}
                                style={{marginLeft: 50, width: 400}} 
                                title={getStepTitle()} 
                                extra={
                                    <Space>
                                        {
                                            modalStep > 0 && <Button type="primary" onClick={() => setModalStep(modalStep - 1)}>上一步</Button>
                                        }
                                        {
                                            modalStep == 5 ? <Button type="primary" loading={outboundModalLoading} onClick={() => submitOutbound()}>提交</Button> : <Button type="primary" onClick={() => setModalStep(modalStep + 1)}>下一步</Button>
                                        }     
                                    </Space>
                                }
                            >
                                {
                                    modalStep == 0 && 
                                        <Space direction="vertical">
                                            <Radio.Group 
                                                onChange={choosedRoute} 
                                                value={outboundModalData.routeId}
                                            >
                                                {
                                                    routeList.map((item, index) => (
                                                        <Radio style={radioStyle} value={item.id} key={index}>{item.routeName}</Radio>
                                                    ))
                                                }
                                            </Radio.Group>
                                        </Space>
                                }
                                {
                                    modalStep == 1 && 
                                        <Space direction="vertical">
                                            <Checkbox.Group onChange={chooseSites} value={outboundModalData.sites.map(item => item.siteId)}>
                                                {
                                                    siteList.map((item, index) => (
                                                        <Checkbox style={radioStyle} value={item.id} key={index}>{item.siteName}</Checkbox>
                                                    ))
                                                }
                                            </Checkbox.Group>
                                        </Space>
                                }
                                {
                                    modalStep == 2 && 
                                        <Space direction="vertical">
                                            <Checkbox.Group onChange={choosePackageOrder} value={outboundModalData.packageOrderNos}>
                                                {
                                                    packageOrderList.map((item, index) => (
                                                        <Checkbox style={radioStyle} value={item.packageNo} key={index}>{`${item.packageNo}/${item.masterOrderNo}`}</Checkbox>
                                                    ))
                                                }
                                            </Checkbox.Group>
                                        </Space>
                                }
                                {
                                    modalStep == 3 && 
                                        <Space direction="vertical">
                                            <Radio.Group 
                                                onChange={choosedDriver} 
                                                value={outboundModalData.driverId}
                                            >
                                                {
                                                    driverList.map((item, index) => (
                                                        <Radio style={radioStyle} value={item.id} key={index}>{item.driverName}</Radio>
                                                    ))
                                                }
                                            </Radio.Group>
                                        </Space>
                                }
                                {
                                    modalStep == 4 && 
                                        <Space direction="vertical">
                                            <Radio.Group 
                                                onChange={chooseVans} 
                                                value={outboundModalData.vansId}
                                            >
                                                {
                                                    vansList.map((item, index) => (
                                                        <Radio style={radioStyle} value={item.id} key={index}>{item.vansNumber}</Radio>
                                                    ))
                                                }
                                            </Radio.Group>
                                        </Space>
                                }
                                {
                                    modalStep == 5 && 
                                        <Descriptions
                                            bordered
                                            title="已选择配置"
                                            size="small"
                                        >
                                            <Descriptions.Item label="路线" span={3}>{outboundModalData.routeName}</Descriptions.Item>
                                            <Descriptions.Item label="司机" span={3}>{outboundModalData.driverName}</Descriptions.Item>
                                            <Descriptions.Item label="车辆" span={3}>{outboundModalData.vansNumber}</Descriptions.Item>
                                            <Descriptions.Item label="订单" span={3}>
                                                {
                                                    outboundModalData.packageOrderNos && outboundModalData.packageOrderNos.join('、')
                                                }
                                            </Descriptions.Item>
                                            <Descriptions.Item label="送货站点" span={3}>{
                                                outboundModalData.sites && outboundModalData.sites.map(site => site.siteName).join(' -> ')
                                            }</Descriptions.Item>
                                        </Descriptions>
                                }
                            </Card>
                        </Space>
                    </Modal>
                </div>
                <Modal
                    width={500}
                    destroyOnClose
                    title="出库单详情"
                    visible={outboundDetailModalProps.visible}
                    onCancel={handleOutboundDetailModalClose}
                    onOk={printOutbound}
                    okText="打印"
                >
                    <div id={'printArea'}>
                        <Descriptions
                            bordered
                            size="small"
                        >
                            <Descriptions.Item label="路线" span={3}>{outboundDetailModalData.routeName}</Descriptions.Item>
                            <Descriptions.Item label="司机" span={3}>{outboundDetailModalData.driverName}</Descriptions.Item>
                            <Descriptions.Item label="车辆" span={3}>{outboundDetailModalData.vansNumber}</Descriptions.Item>
                            <Descriptions.Item label="订单" span={3}>
                                {
                                    outboundDetailModalData.packageOrderNos && outboundDetailModalData.packageOrderNos.join('、')
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="送货站点" span={3}>
                                {
                                    outboundDetailModalData.sites && outboundDetailModalData.sites.map(site => site.siteName).join(' -> ')
                                }
                                </Descriptions.Item>
                        </Descriptions>
                    </div>
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
                <TabPane tab="出库管理" key="1">
                    {randerTableComponents()}
                </TabPane>
            </Tabs>
        </div>
    )
}