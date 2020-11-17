import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Drawer, Form, Row, Col, Switch, Tooltip, Modal, Tabs, Descriptions, Badge, Tag} from 'antd';
import { SearchOutlined, PlusOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import httpUtil from '../../../utils/request'
import AreaSelect from '../../../components/areaSelect'
import { Map, Marker } from 'react-amap';
import styles from './style.less'

const { Option } = Select;
const { TabPane } = Tabs

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

const MOCK_DATA = [{"sn":"521201026184904","siteId":4,"siteName":"力方本部测试充电站","name":"新板子打样测试","agentName":"刘经纬","agentPhone":"13913969478","signalPower":26,"hwStatus":1,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":25.62,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路88号","lon":"118.74281","lat":"31.93839","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460046427901024","createTime":"2020-10-26 20:01:58.0","updateTime":"2020-10-28 17:57:53.0"},{"sn":"521190920212949","siteId":4,"siteName":"力方本部测试充电站","name":"colin","agentName":"刘经纬","agentPhone":"13913969478","signalPower":26,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":18.31,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460046427901025","createTime":"2020-10-15 13:54:08.0","updateTime":"2020-10-28 10:22:40.0"},{"sn":"521200919131808","siteId":463,"siteName":"力方智充项目分享演示站点","name":"力方智充项目分享会演示5号","agentName":"刘经纬","agentPhone":"13913969478","signalPower":31,"hwStatus":1,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":32.0,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460043154307796","createTime":"2020-10-14 13:35:55.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521200919132401","siteId":463,"siteName":"力方智充项目分享演示站点","name":"力方智充项目分享会演示4号","agentName":"刘经纬","agentPhone":"13913969478","signalPower":23,"hwStatus":1,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":35.25,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460043154307798","createTime":"2020-10-14 13:35:27.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521200919132941","siteId":463,"siteName":"力方智充项目分享演示站点","name":"力方智充项目分享会演示3号","agentName":"刘经纬","agentPhone":"13913969478","signalPower":26,"hwStatus":1,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":33.93,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460043154307795","createTime":"2020-10-14 13:35:04.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521200919133519","siteId":463,"siteName":"力方智充项目分享演示站点","name":"力方智充项目分享会演示2号","agentName":"刘经纬","agentPhone":"13913969478","signalPower":21,"hwStatus":1,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":31.81,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460043154307797","createTime":"2020-10-14 13:34:39.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521200919133133","siteId":463,"siteName":"力方智充项目分享演示站点","name":"力方智充项目分享会演示1号","agentName":"刘经纬","agentPhone":"13913969478","signalPower":27,"hwStatus":1,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":32.75,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460043154307794","createTime":"2020-10-14 13:34:06.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521181116111635","siteId":4,"siteName":"力方本部测试充电站","name":"44444444444","agentName":"刘经纬","agentPhone":"13913969478","signalPower":28,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":26.37,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路88号","lon":"118.74281","lat":"31.93836","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":null,"createTime":"2020-09-24 16:25:36.0","updateTime":"2020-09-24 16:30:27.0"},{"sn":"521200821091146","siteId":4,"siteName":"力方本部测试充电站","name":"9楼插座测试","agentName":"刘经纬","agentPhone":"13913969478","signalPower":31,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":29.31,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路88号","lon":"118.74281","lat":"31.93836","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460046427901025","createTime":"2020-09-22 09:18:36.0","updateTime":"2020-09-25 14:33:47.0"},{"sn":"521200717170638","siteId":4,"siteName":"力方本部测试充电站","name":"9楼-测试","agentName":"刘经纬","agentPhone":"13913969478","signalPower":31,"hwStatus":0,"beeperStatus":0,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":32.56,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":"2020-09-30 14:36:22.0","thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460047970704497","createTime":"2020-09-04 19:15:58.0","updateTime":"2020-10-29 14:29:40.0"},{"sn":"521200709153212","siteId":4,"siteName":"力方本部测试充电站","name":"202007测试","agentName":"刘经纬","agentPhone":"13913969478","signalPower":31,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":25.93,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路30号","lon":"118.744548","lat":"31.937768","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460048187607065","createTime":"2020-07-29 11:37:29.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521190920161603","siteId":4,"siteName":"力方本部测试充电站","name":"广州检测","agentName":"刘经纬","agentPhone":"13913969478","signalPower":23,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":31.25,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"广东省","city":"广州市","county":"黄埔区","address":"联和街道天泰一路3号","lon":"113.462179","lat":"23.162382","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":"460047970805330","createTime":"2020-06-04 11:09:38.0","updateTime":"2020-10-26 10:14:36.0"},{"sn":"521181117135501","siteId":4,"siteName":"力方本部测试充电站","name":"测试2号机器","agentName":"刘经纬","agentPhone":"13913969478","signalPower":26,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":35.0,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"秦淮区","address":"朝天宫街道王府大街90-2号","lon":"118.778447","lat":"32.037683","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":null,"createTime":"2019-02-27 14:46:55.0","updateTime":"2020-07-30 09:29:26.0"},{"sn":"521181116181631","siteId":6,"siteName":"认证测试充电站","name":"消防测试","agentName":"刘经纬","agentPhone":"13913969478","signalPower":31,"hwStatus":1,"beeperStatus":1,"status":0,"outletCount":16,"outletRepairCount":0,"outletStatus":"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0","latestTemper":23.0,"isOwn":0,"maxPower":"900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900","province":"江苏省","city":"南京市","county":"雨花台区","address":"铁心桥街道大周路86号","lon":"118.74316","lat":"31.93847","setOwnTime":null,"thresholdStopCurrent":0.34,"freeChargeTime":120,"isCheckPlugOff":1,"imsi":null,"createTime":"2019-01-15 14:54:55.0","updateTime":"2020-10-26 10:14:36.0"}]


const Device = () => {

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
            title: '序列号',
            dataIndex: 'sn',
            align: 'center',
            sorter: true,
            fixed: 'left',
            width: 170,
            render: text => <span className={styles.sn} onClick={handleDeviceModalOpen}>{text}</span>
        },
        {
            title: '名称',
            dataIndex: 'name',
            align: 'center',
            fixed: 'left',
            sorter: true,
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '硬件',
            dataIndex: 'hwStatus',
            align: 'center',
            render: hwStatus => hwStatus == 1 ? '离线' : '在线'
        },
        {
            title: '信号',
            dataIndex: 'signalPower',
            align: 'center',
            sorter: true,
        },
        {
            title: '站点ID',
            dataIndex: 'siteId',
            align: 'center',
        },
        {
            title: '站点名',
            dataIndex: 'siteName',
            align: 'center',
            sorter: true,
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '插座数',
            dataIndex: 'outletCount',
            align: 'center',
            sorter: true,
        },
        {
            title: '异常数',
            dataIndex: 'outletRepairCount',
            align: 'center',
            sorter: true,
        },
        {
            title: '插座状态',
            dataIndex: 'outletStatus',
            align: 'center',
            sorter: true,
            width: 250,
            render: text => {
                if (text == '' || text == null) {
                    return ''
                }

                let statusList = text.split(',') || []
                let normalList = statusList.filter(s => s == 0)
                let busyList = statusList.filter(s => s == 1)
                let unknownList = statusList.filter(s => s == 2)
                return (
                    <>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            {statusList.length}
                        </Tag>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            {statusList.length}
                        </Tag>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            {statusList.length}
                        </Tag>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            {statusList.length}
                        </Tag>
                    </>
                )
            }
        },
        {
            title: '买断',
            dataIndex: 'isOwn',
            align: 'center',
            width: 50,
            // sorter: true,
            render: isOwn => isOwn == 1 ? '是' : '否'
        },
        {
            title: '运营',
            dataIndex: 'isCheckPlugOff',
            align: 'center',
            sorter: true,
            render: isCheckPlugOff => <Switch checkedChildren="上线" unCheckedChildren="下线" checked={isCheckPlugOff} />
        },
        {
            title: '蜂鸣器',
            dataIndex: 'beeperStatus',
            align: 'center',
            sorter: true,
            render: beeperStatus => <Switch checkedChildren="开" unCheckedChildren="关" checked={beeperStatus} />
        },
        {
            title: '温度',
            dataIndex: 'latestTemper',
            align: 'center',
            sorter: true,
        },
        { 
            title: '功率上限', 
            dataIndex: 'maxPower',
            key: "maxPower",
            align: 'center',
            sorter: true,
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: maxPower => <Tooltip placement="topLeft" title={maxPower}>{maxPower}</Tooltip>
        },
        { 
            title: '省', 
            dataIndex: 'province',
            align: 'center',
            sorter: true,
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        { 
            title: '市', 
            dataIndex: 'city',
            align: 'center',
            sorter: true,
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        { 
            title: '区/县', 
            dataIndex: 'county',
            align: 'center',
            sorter: true,
            width: 100,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        { 
            title: '详细地址', 
            dataIndex: 'address',
            align: 'center',
            sorter: true,
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '卡IMSI',
            dataIndex: 'imsi',
            align: 'center',
            width: 170
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            align: 'center',
            sorter: true,
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            sorter: true,
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            fixed: 'right',
            width: 60,
            render: (text, record) => (
                <Space>
                    <DeleteOutlined />
                    <EditOutlined />
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


    const [deviceModalProps, setDeviceModalProps] = useState({
        visible: false,
        title: '设备详情'
    })
    const [modalDeviceDetail, setModalDeviceDetail] = useState({})
    const [modalDeviceStartingUpInfo, setModalDeviceStartingUpInfo] = useState([{"sn":"521201026184904","voltage":227.0,"currents":"0.003404,0.003405,0.003396,0.003614,0.003349,0.003621,0.003342,0.003635,0.003392,0.003556,0.00338,0.00349,0.003389,0.003495,0.00337,0.003409","createTime":"2020-10-29 15:10:55.0"},{"sn":"521201026184904","voltage":227.0,"currents":"0.003406,0.003387,0.003389,0.00363,0.003368,0.003497,0.003363,0.003544,0.003373,0.003479,0.00338,0.003484,0.003384,0.003502,0.003375,0.003416","createTime":"2020-10-28 15:46:55.0"},{"sn":"521201026184904","voltage":226.0,"currents":"0.003384,0.003362,0.003368,0.003585,0.003346,0.003531,0.003425,0.003648,0.003377,0.003547,0.00338,0.003479,0.003382,0.003506,0.003363,0.003411","createTime":"2020-10-28 15:33:42.0"},{"sn":"521201026184904","voltage":225.0,"currents":"0.003368,0.003375,0.003358,0.00361,0.003308,0.003441,0.00338,0.003495,0.003334,0.003425,0.00332,0.003456,0.003349,0.003454,0.003322,0.003344","createTime":"2020-10-28 10:05:16.0"},{"sn":"521201026184904","voltage":226.0,"currents":"0.003404,0.003389,0.003373,0.003614,0.003344,0.003529,0.003401,0.003632,0.003342,0.003479,0.003349,0.003468,0.003363,0.003468,0.003327,0.003364","createTime":"2020-10-28 09:53:09.0"},{"sn":"521201026184904","voltage":227.0,"currents":"0.003396,0.003396,0.003389,0.003614,0.003373,0.003484,0.003413,0.003617,0.003353,0.003533,0.003356,0.003459,0.00337,0.003475,0.003344,0.003396","createTime":"2020-10-27 18:13:23.0"},{"sn":"521201026184904","voltage":227.0,"currents":"0.003394,0.003382,0.00337,0.003596,0.003337,0.003475,0.003356,0.003475,0.003351,0.003486,0.003358,0.003481,0.003361,0.003459,0.003337,0.003396","createTime":"2020-10-27 18:09:32.0"},{"sn":"521201026184904","voltage":227.0,"currents":"0.003387,0.003364,0.003387,0.003601,0.003365,0.003447,0.00337,0.00356,0.003344,0.003486,0.003346,0.003456,0.003363,0.003463,0.003332,0.003389","createTime":"2020-10-27 18:08:24.0"},{"sn":"521201026184904","voltage":227.0,"currents":"0.003404,0.0034,0.003382,0.003574,0.003349,0.00338,0.003339,0.003456,0.003373,0.003513,0.003344,0.00345,0.003358,0.003447,0.003346,0.00336","createTime":"2020-10-27 17:18:40.0"},{"sn":"521201026184904","voltage":227.0,"currents":"0.003401,0.003405,0.00342,0.003635,0.003387,0.003549,0.003396,0.003524,0.003396,0.003549,0.003423,0.003506,0.003415,0.00354,0.003392,0.003429","createTime":"2020-10-26 20:50:12.0"},{"sn":"521201026184904","voltage":228.0,"currents":"0.003396,0.0034,0.003411,0.003662,0.003389,0.003576,0.00348,0.00359,0.003399,0.003576,0.003425,0.003515,0.00343,0.00352,0.003401,0.003432","createTime":"2020-10-26 20:13:09.0"}])
    const modalDeviceStartingUpInfoColumn = [
        {
            title: '电压（V）',
            dataIndex: 'voltage',
            align: 'center',
            sorter: true,
            width: 150
        },
        {
            title: '电流（A）',
            dataIndex: 'currents',
            ellipsis: {
                title: false
            },
            align: 'center',
            sorter: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            sorter: true,
            width: 200
        }
    ]
    const [modalDeviceTemperInfo, setModalDeviceTemperInfo] = useState([{"sn":"521201026184904","temper":25.06,"createTime":"2020-10-29 15:27:36.0"},{"sn":"521201026184904","temper":23.0,"createTime":"2020-10-29 15:11:22.0"},{"sn":"521201026184904","temper":25.62,"createTime":"2020-10-28 17:47:47.0"},{"sn":"521201026184904","temper":25.68,"createTime":"2020-10-28 17:17:38.0"},{"sn":"521201026184904","temper":25.93,"createTime":"2020-10-28 16:47:30.0"},{"sn":"521201026184904","temper":26.12,"createTime":"2020-10-28 16:17:22.0"},{"sn":"521201026184904","temper":24.56,"createTime":"2020-10-28 15:47:14.0"},{"sn":"521201026184904","temper":22.93,"createTime":"2020-10-28 15:34:01.0"},{"sn":"521201026184904","temper":24.25,"createTime":"2020-10-28 10:12:40.0"},{"sn":"521201026184904","temper":22.18,"createTime":"2020-10-28 10:05:35.0"},{"sn":"521201026184904","temper":21.62,"createTime":"2020-10-28 09:53:32.0"},{"sn":"521201026184904","temper":27.81,"createTime":"2020-10-27 20:44:27.0"},{"sn":"521201026184904","temper":27.81,"createTime":"2020-10-27 20:14:19.0"},{"sn":"521201026184904","temper":27.75,"createTime":"2020-10-27 19:44:11.0"},{"sn":"521201026184904","temper":27.87,"createTime":"2020-10-27 19:14:03.0"}])
    const modalDeviceTemperInfoColumn = [
        {
            title: '时间',
            dataIndex: 'createTime',
            align: 'center',
            sorter: true,
            width: 150
        },
        {
            title: '温度（℃）',
            dataIndex: 'temper',
            align: 'center',
            sorter: true,
            width: 200
        }
    ]
    const handleDeviceModalClose = () => {
        setDeviceModalProps({
            visible: false,
            title: '设备详情'
        })
    }
    const handleDeviceModalOpen = () => {
        setDeviceModalProps({
            visible: true,
            title: '设备详情'
        })
    }

    return (
        <div>
            <Card title="数据检索" extra={
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<SearchOutlined />}>
                            搜索
                    </Button>
                </Space>
            }>
                <Space direction="vertical">
                    <Space>
                        <Input 
                            style={inputStyle} 
                            size="middle" 
                            placeholder="请输入序列号" 
                            allowClear 
                            onChange={e => {
                                const { value } = e.target
                                setQueryCondition({
                                    ...queryCondition,
                                    orderNo: value
                                })
                            }} 
                        />
                        <Input 
                            style={inputStyle} 
                            size="middle" 
                            placeholder="请输入站点ID" 
                            allowClear 
                            onChange={e => {
                                const { value } = e.target
                                setQueryCondition({
                                    ...queryCondition,
                                    orderNo: value
                                })
                            }} 
                        />
                        <Input 
                            style={inputStyle} 
                            size="middle" 
                            placeholder="请输入站点名" 
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
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择是否买断"
                            allowClear 
                            onChange={e => setQueryCondition({...queryCondition, orderStatus: e})}
                        >
                            <Option value="1">关闭</Option>
                            <Option value="2">启用</Option>
                        </Select>
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择运营状态"
                            allowClear 
                            onChange={e => setQueryCondition({...queryCondition, orderStatus: e})}
                        >
                            <Option value="1">关闭</Option>
                            <Option value="2">启用</Option>
                        </Select>
                    </Space>
                    <Space>
                        <Select
                            size="middle"
                            style={borderRadius}
                            placeholder="请选择硬件状态反馈"
                            allowClear 
                            onChange={e => setQueryCondition({...queryCondition, orderStatus: e})}
                        >
                            <Option value="1">关闭</Option>
                            <Option value="2">启用</Option>
                        </Select>
                        <Select
                            size="middle"
                            style={inputStyle}
                            placeholder="请选择省"
                            allowClear 
                        >
                        </Select>
                        <Select
                            size="middle"
                            style={inputStyle}
                            placeholder="请选择市"
                            allowClear 
                        >
                        </Select>
                        <Select
                            size="middle"
                            style={inputStyle}
                            placeholder="请选择区"
                            allowClear 
                        >
                        </Select>
                    </Space>
                </Space>
            </Card>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" onClick={handleStationDrawerOpen} icon={<PlusOutlined />}>
                        添加
                    </Button>
                </Space>
                <Table
                    size="small"
                    bordered={true}
                    scroll={{ x: 3200 }}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={MOCK_DATA}
                    pagination={{
                        total: MOCK_DATA.length
                    }}
                    loading={loading}
                    onChange={async (pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
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
                                label="序列号"
                                rules={[{ required: true, message: '请填写序列号' }]}
                            >
                                <Input placeholder="请填写序列号" defaultValue={stationDrawerData.screenNo} onChange={e => setDrawerInputValue(e, 'screenNo')}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="screenNo"
                                label="名称"
                                rules={[{ required: true, message: '请填写名称' }]}
                            >
                                <Input placeholder="请填写名称" defaultValue={stationDrawerData.screenNo} onChange={e => setDrawerInputValue(e, 'screenNo')}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="osType"
                            label="站点"
                            rules={[{ required: true, message: '请选择站点' }]}
                            >
                                <Select placeholder="请选择站点" defaultValue={stationDrawerData.osType} onChange={e => setDrawerInputValue(e, 'osType')}>
                                    <Option value={1}>Android</Option>
                                    <Option value={2}>Ios</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="osType"
                            label="蜂鸣器状态"
                            rules={[{ required: true, message: '请选择蜂鸣器状态' }]}
                            >
                                <Select placeholder="请选择蜂鸣器状态" defaultValue={stationDrawerData.osType} onChange={e => setDrawerInputValue(e, 'osType')}>
                                    <Option value={1}>Android</Option>
                                    <Option value={2}>Ios</Option>
                                </Select>
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
            <Modal
                width={1000}
                destroyOnClose
                title={deviceModalProps.title}
                visible={deviceModalProps.visible}
                onCancel={handleDeviceModalClose}
                footer={null}
            >
                <Tabs defaultActiveKey="1" style={{marginTop: -30}}>
                    <TabPane tab="设备详情" key="1">
                        <Descriptions bordered size="small">
                            <Descriptions.Item label="序列号">521201026184904</Descriptions.Item>
                            <Descriptions.Item label="名称" span={2}>新板子打样测试</Descriptions.Item>
                            <Descriptions.Item label="站点ID">4</Descriptions.Item>
                            <Descriptions.Item label="站点名称" span={2}>力方本部测试充电站</Descriptions.Item>
                            <Descriptions.Item label="是否买断">否</Descriptions.Item>
                            <Descriptions.Item label="功率上限" span={2}>900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900</Descriptions.Item>
                            <Descriptions.Item label="信号强度">28</Descriptions.Item>
                            <Descriptions.Item label="蜂鸣器状态" span={2}><Badge status="default" text="关闭" /></Descriptions.Item>
                            <Descriptions.Item label="硬件状态反馈"><Badge status="default" text="离线" /></Descriptions.Item>
                            <Descriptions.Item label="运营状态" span={2}><Badge status="processing" text="上线" /></Descriptions.Item>
                            <Descriptions.Item label="插座数量">16</Descriptions.Item>
                            <Descriptions.Item label="插座状态" span={2}>0，0，0，0，0，0，</Descriptions.Item>
                            <Descriptions.Item label="温度">25.06</Descriptions.Item>
                            <Descriptions.Item label="卡IMSI" span={2}>460046427901024</Descriptions.Item>
                            <Descriptions.Item label="省">江苏省</Descriptions.Item>
                            <Descriptions.Item label="市">南京市</Descriptions.Item>
                            <Descriptions.Item label="区/县">雨花台区</Descriptions.Item>
                            <Descriptions.Item label="详细地址" span={3}>梅山村邱村69号</Descriptions.Item>
                            <Descriptions.Item label="精度">118.74281</Descriptions.Item>
                            <Descriptions.Item label="纬度" span={2}>31.93839</Descriptions.Item>
                            <Descriptions.Item label="创建时间">2020-10-26 20:01:58</Descriptions.Item>
                            <Descriptions.Item label="更新时间" span={2}>2020-10-29 15:56:29</Descriptions.Item>
                        </Descriptions>
                    </TabPane>
                    <TabPane tab="启动信息" key="2">
                        <Table
                            size="small"
                            bordered={true}
                            style={{marginTop: 12}}
                            columns={modalDeviceStartingUpInfoColumn}
                            rowKey={record => record.id}
                            dataSource={modalDeviceStartingUpInfo}
                            pagination={{
                                total: modalDeviceStartingUpInfo.length
                            }}
                            loading={loading}
                            onChange={async (pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
                        />
                    </TabPane>
                    <TabPane tab="设备温度" key="3">
                        <Table
                            size="small"
                            bordered={true}
                            style={{marginTop: 12}}
                            columns={modalDeviceTemperInfoColumn}
                            rowKey={record => record.id}
                            dataSource={modalDeviceTemperInfo}
                            pagination={{
                                total: modalDeviceTemperInfo.length
                            }}
                            loading={loading}
                            onChange={async (pagination, filters, sorter) => handleTableChange(pagination, filters, sorter)}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
    )
}

export default Device