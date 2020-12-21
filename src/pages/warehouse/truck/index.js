import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Checkbox, Radio, Divider, message, Form, Input, Modal, Popconfirm} from 'antd';
import styles from './style.less'
import { CopyOutlined, PlusOutlined } from '@ant-design/icons';
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

const firstGridStyle = {
    width: '23%',
    textAlign: 'center',
}
const gridStyle = {
    width: '11%',
    textAlign: 'center',
};

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

export default function Truck() {

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

    const getTruckList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/vans/page', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getTruckList()
        getStoreList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '车牌号',
            dataIndex: 'vansNumber',
            align: 'center',
        },
        {
            title: '车型',
            dataIndex: 'vansType',
            align: 'center',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link onClick={() => handleTruckModalOpen(record)}>编辑</Typography.Link>
                    {
                        !record.isDel ? 
                            <Popconfirm placement="topLeft" title="确定删除该货车吗?" onConfirm={() => delTruck(record.id)} okText="确定" cancelText="取消">
                                <Typography.Link type="danger">删除</Typography.Link>
                            </Popconfirm>
                            :
                            <Typography.Link>恢复</Typography.Link>
                    }
                </Space>
            )
        }
    ];

    const renderSchedulingCard = () => {
        return (
            <Card 
                size="small"
                title="（2020-10-01 ～ 2020-10-07）货车排班表" 
                extra={
                    <Space size={60}>
                        <Radio.Group>
                            <Radio.Button value="large">上一周</Radio.Button>
                            <Radio.Button value="default">当前周</Radio.Button>
                            <Radio.Button value="small">下一周</Radio.Button>
                        </Radio.Group>
                        <Button icon={<CopyOutlined />} type="primary">复制上周排班</Button>
                    </Space>
                }
            >
                <Card.Grid hoverable={false} style={firstGridStyle}></Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/1</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/2</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/3</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/4</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/5</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/6</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>10/7</Card.Grid>

                <Card.Grid hoverable={false} style={firstGridStyle}>货车车牌（车型）</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周一</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周二</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周三</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周四</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周五</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周六</Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle}>周日</Card.Grid>

                <Card.Grid style={firstGridStyle}>
                    <Space size={20}>
                        <Select style={{width: 100}}>
                            <Select.Option>货车1</Select.Option>
                            <Select.Option>货车2</Select.Option>
                            <Select.Option>货车3</Select.Option>
                        </Select>
                        <Checkbox size="small">全可用</Checkbox>
                    </Space>
                </Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">可用</Checkbox></Card.Grid>
            </Card>
        )
    }


    const [truckModalProps, setTruckModalProps] = useState({
        visible: false,
        title: '新增车辆'
    })
    const [truckModalData, setTruckModalData] = useState({})
    const [truckModalLoading, setTruckModalLoading] = useState(false)
    const handleTruckModalOpen = (data = {}) => {
        setTruckModalProps({
            visible: true,
            title: data.id ? '更新车辆信息': '新增车辆'
        })
        setTruckModalData(data)
    }
    const handleTruckModalClose = () => {
        setTruckModalProps({
            visible: false,
            title: '新增车辆'
        })
        setTruckModalData({})
        setTruckModalLoading(false)
    }
    const handleTruckModalOk = async () => {
        let data = {
            vansNumber: truckModalData.vansNumber,
            vansType: truckModalData.vansType,
            storeName: choosedStore.storeName,
            storeId: choosedStore.id,
        }
        if (truckModalData.id) {
            data.id = truckModalData.id
        }
    
        setTruckModalLoading(true)
        await httpUtils.post(data.id ? '/admin/vans/update' : '/admin/vans/add', data)
        message.success('操作成功')
        handleTruckModalClose()
        getTruckList()
    }
    
    const delTruck = async truckId => {
        await httpUtils.post(`/admin/vans/del/${truckId}`)
        message.success("删除成功")
        getTruckList()
    }

    const randerTable = () => {
        return (
            <div>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleTruckModalOpen()}>
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
                    onChange={async (pagination, filters, sorter) => getTruckList(pagination)}
                />
                <Modal
                    destroyOnClose
                    title={truckModalProps.title}
                    visible={truckModalProps.visible}
                    onOk={handleTruckModalOk}
                    confirmLoading={truckModalLoading}
                    onCancel={handleTruckModalClose}
                >
                    <Form size="large" {...layout}>
                        <Form.Item
                            label="车牌号"
                        >
                            <Input 
                                value={truckModalData.vansNumber} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setTruckModalData({
                                        ...truckModalData,
                                        vansNumber: value
                                    })
                                }}  
                                placeholder="请输入车牌号" />
                        </Form.Item>
                        <Form.Item
                            label="车辆类型"
                        >
                            <Input 
                                value={truckModalData.vansType} 
                                size="large" 
                                onChange={e => {
                                    const { value } = e.target

                                    setTruckModalData({
                                        ...truckModalData,
                                        vansType: value
                                    })
                                }}  
                                placeholder="请输入车辆类型" />
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
                <TabPane tab="货车排班" key="1">
                    {renderSchedulingCard()}
                </TabPane>
                <TabPane tab="货车列表" key="2">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}