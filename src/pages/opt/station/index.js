import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Drawer, Form, Row, Col, Switch} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import httpUtil from '../../../utils/request'
import AreaSelect from '../../../components/areaSelect'
import { Map, Marker } from 'react-amap';

const { Option } = Select;

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

const Station = () => {

    const [data, setData] = useState({})
    const [queryCondition, setQueryCondition] = useState({
        orderNo: '',
        orderType: '',
        orderStatus: ''
    })
    
    const [loading, setLoading] = useState(false)

    useEffect(() => {

    }, ["", queryCondition])

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination) 
        console.log(filters)
        console.log(sorter)
    }

    const [stationDrawerProps, setStationDrawerProps] = useState({
        visible: false,
        title: '新增站点'
    })
    const [stationDrawerData, setStationDrawerData] = useState({})
    const [stationDrawerLoading, setStationDrawerLoading] = useState(false)
    const handleStationDrawerOpen = (data = {}) => {
        setStationDrawerProps({
            visible: true,
            title: data.id ? '更新站点信息' : '新增站点'
        })
        if (data.id) {
            setStationDrawerData(data)
        }
    }
    const handleStationDrawerOk = () => {

    }
    const handleStationDrawerClose = () => {
        setStationDrawerProps({
            visible: false,
            title: '新增站点'
        })
        setStationDrawerData({})
        setStationDrawerLoading(false)
    }

    const setDrawerInputValue = (e, valueName) => {
        const { value } = e.target
        setStationDrawerData({
            ...stationDrawerData,
            [valueName]: value
        })
    }

    const columns = [
        {
            title: '站点ID',
            dataIndex: 'orderNo',
            align: 'center',
            sorter: true,
            width: 150
        },
        {
            title: '名称',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '物业',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '白名单机制',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
            width: 150
        },
        {
            title: '白名单用户',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '白名单免费充电',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
            width: 150
        },
        {
            title: '非白名单收费充电',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
        },
        {
            title: '最低消费金额（元）',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
            width: 200
        },
        {
            title: '最低消费进入时间（分钟）',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
            width: 250
        },
        {
            title: '费率详情',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '按小时收费',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '省',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
        },
        {
            title: '市',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
        },
        {
            title: '区/县',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
        },
        {
            title: '详细地址',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            fixed: 'right',
            render: (text, record) => (
                <Space>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle">修改</Button>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle" danger>删除</Button>
                    <Button style={{borderRadius: '4px'}} type="primary" size="middle">设置白名单</Button>
                </Space>
            )
        }
    ];

    let mapOptions = {
        city: "北京",
        mapCenter:[116.418261, 39.921984],  //城市定位，经纬度定位只能选择1个
        mapZoom: 10, //地图缩放
        mapKey: '95065ba531f10772260db34e27b35866',   //你的高德key
        status: { //是否支持放大拖拽
            zoomEnable: true,
            dragEnable: true,
        },
        mapMaker :[  //marker标记点(list)
            {lnglat:[116.401728,39.911984],text:'要显示的内容1'},
            {lnglat:[116.436691,39.921984],text:'要显示的内容2'}
        ],
        plugins:['ToolBar']
    }

    return (
        <div>
            <Card title="数据检索" extra={
                <Space>
                    <Button style={borderRadius} type="primary" size="large" icon={<SearchOutlined />}>
                            搜索
                    </Button>
                </Space>
            }>
                <Space>
                    <Input 
                        style={inputStyle} 
                        size="large" 
                        placeholder="请输入站点名称" 
                        allowClear 
                        onChange={e => {
                            const { value } = e.target
                            setQueryCondition({
                                ...queryCondition,
                                orderNo: value
                            })
                        }} 
                    />
                    <Select
                        size="large"
                        style={borderRadius}
                        placeholder="请选择白名单机制"
                        allowClear 
                        onChange={e => setQueryCondition({...queryCondition, orderStatus: e})}
                    >
                        <Option value="1">关闭</Option>
                        <Option value="2">启用</Option>
                    </Select>
                    <Select
                        size="large"
                        style={borderRadius}
                        placeholder="请选择省"
                        allowClear 
                    >
                    </Select>
                    <Select
                        size="large"
                        style={borderRadius}
                        placeholder="请选择市"
                        allowClear 
                    >
                    </Select>
                    <Select
                        size="large"
                        style={borderRadius}
                        placeholder="请选择区"
                        allowClear 
                    >
                    </Select>
                </Space>
            </Card>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="large" onClick={handleStationDrawerOpen} icon={<PlusOutlined />}>
                        添加
                    </Button>
                </Space>
                <Table
                    bordered={true}
                    scroll={{ x: 2800 }}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data.dataList}
                    pagination={{
                        total: data.totalCount
                    }}
                    loading={loading}
                    onChange={async (pagination, filters, sorter) => handleTableChange(pagination)}
                />
            </div>
            <Drawer
                title={stationDrawerProps.title}
                destroyOnClose
                width={720}
                onClose={handleStationDrawerClose}
                visible={stationDrawerProps.visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                    style={{
                        textAlign: 'right',
                    }}
                    >
                    <Button onClick={handleStationDrawerClose} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={handleStationDrawerOk} loading={stationDrawerLoading} type="primary">
                        添加
                    </Button>
                    </div>
                }
            >
                <Form layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="screenNo"
                                label="站点名称"
                                rules={[{ required: true, message: '请填写站点名称' }]}
                            >
                                <Input placeholder="请填写站点名称" defaultValue={stationDrawerData.screenNo} onChange={e => setDrawerInputValue(e, 'screenNo')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="osType"
                            label="费率"
                            rules={[{ required: true, message: '请选择费率' }]}
                            >
                                <Select placeholder="请选择费率" defaultValue={stationDrawerData.osType} onChange={e => setDrawerInputValue(e, 'osType')}>
                                    <Option value={1}>Android</Option>
                                    <Option value={2}>Ios</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="osType"
                            label="按小时收费"
                            rules={[{ required: true, message: '请选择收费方式' }]}
                            >
                                <Select placeholder="请选择收费方式" defaultValue={stationDrawerData.osType} onChange={e => setDrawerInputValue(e, 'osType')}>
                                    <Option value={1}>Android</Option>
                                    <Option value={2}>Ios</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="osVersion"
                            label="最低消费金额"
                            rules={[{ required: true, message: '请输入最低消费金额' }]}
                            >
                                <Input placeholder="请输入最低消费金额" type="number" defaultValue={stationDrawerData.osVersion} addonAfter="元" onChange={e => setDrawerInputValue(e, 'osVersion')}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="pixel"
                            label="最低消费进入时间"
                            rules={[{ required: true, message: '请输入最低消费进入时间' }]}
                            >
                                <Input placeholder="请输入最低消费进入时间" type="number" defaultValue={stationDrawerData.osVersion} addonAfter="分" onChange={e => setDrawerInputValue(e, 'osVersion')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="screenType"
                            label="物业"
                            rules={[{ required: true, message: '请选择物业' }]}
                            >
                                <Select placeholder="请选择物业" defaultValue={stationDrawerData.screenType} onChange={e => setDrawerInputValue(e, 'screenType')}>
                                    <Option value={1}>横屏</Option>
                                    <Option value={2}>竖屏</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                name="pixel"
                                label="白名单机制"
                            >
                               <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="pixel"
                                label="白名单免费充电"
                            >
                               <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="pixel"
                                label="非白名单收费充电"
                            >
                               <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="area"
                            label="站点所在省市区"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择屏幕所在地',
                                },
                            ]}
                            >
                                <Input.Group compact>
                                    <AreaSelect style={{ width: '50%' }} saveArea={() => console.log()} />
                                    <Input style={{ width: '50%' }} placeholder="请输入详细地址" defaultValue={stationDrawerData.address} onChange={e => setDrawerInputValue(e, 'address')}/>
                                </Input.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item>
                                <Input.Group>
                                    <Input style={{ width: '50%' }} addonBefore="经度" value={stationDrawerData.lng} disabled />
                                    <Input style={{ width: '50%' }} addonBefore="纬度" value={stationDrawerData.lat} disabled />
                                </Input.Group>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item>
                                <Button type="primary">获取经纬度</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style ={{width:"100%",height:"270px"}}>
                        <Map 
                            amapkey={mapOptions.mapKey} 
                            city={mapOptions.city} 
                            zoom={mapOptions.mapZoom} 
                            center={mapOptions.mapCenter} 
                            status={mapOptions.status} 
                            plugins={mapOptions.plugins} 
                            // events={this.amapEvents}
                        >
                        </Map>
                    </div>
                </Form>
            </Drawer>
        </div>
    )
}

export default Station