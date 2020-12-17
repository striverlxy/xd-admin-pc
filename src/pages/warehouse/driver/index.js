import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Checkbox, Radio, Divider} from 'antd';
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

export default function Driver() {

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
    const [loading, setLoading] = useState(false)

    const getDriverList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setLoading(true)
        let resp = await httpUtils.get('/admin/driver/page', params)
        setData(resp)
        setLoading(false)
    }   

    useEffect(() => {
        getStoreList()
        getDriverList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '司机工号',
            dataIndex: 'driverNo',
            align: 'center',
        },
        {
            title: '司机姓名',
            dataIndex: 'driverName',
            align: 'center',
        },
        {
            title: '司机手机号',
            dataIndex: 'phone',
            align: 'center',
        },
        {
            title: '小程序认证',
            dataIndex: 'wechatAuthStatus',
            align: 'center',
            render: wechatAuthStatus => wechatAuthStatus == 1 ? '未认证' : wechatAuthStatus == 2 ? '认证成功' : '认证失败'
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
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link>详情</Typography.Link>
                </Space>
            )
        }
    ];

    const renderSchedulingCard = () => {
        return (
            <Card 
                size="small"
                title="（2020-10-01 ～ 2020-10-07）出货司机排班表" 
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

                <Card.Grid hoverable={false} style={firstGridStyle}>司机姓名（工号）</Card.Grid>
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
                            <Select.Option>司机1</Select.Option>
                            <Select.Option>司机2</Select.Option>
                            <Select.Option>司机3</Select.Option>
                        </Select>
                        <Checkbox size="small">全当值</Checkbox>
                    </Space>
                </Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
                <Card.Grid style={gridStyle}><Checkbox size="small">当值</Checkbox></Card.Grid>
            </Card>
        )
    }

    const randerTable = () => {
        return (
            <div>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />}>
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
                    loading={loading}
                    onChange={async (pagination, filters, sorter) => getDriverList(pagination)}
                />
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
                <TabPane tab="司机排班" key="1">
                    {renderSchedulingCard()}
                </TabPane>
                <TabPane tab="司机列表" key="2">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}