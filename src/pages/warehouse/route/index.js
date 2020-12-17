import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Space, Divider, Drawer, Card, Form, Input, List} from 'antd';
import styles from './style.less'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
        // {
        //     title: '站点顺序（默认送货顺序）',
        //     dataIndex: 'name',
        //     align: 'center',
        // },
        {
            title: '路线状态',
            dataIndex: 'isOpen',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link>编辑</Typography.Link>
                    <Typography.Link>开启</Typography.Link>
                    <Typography.Link type="danger">停用</Typography.Link>
                </Space>
            )
        }
    ];

    const [routeDrawerProps, setRouteDrawerProps] = useState({
        visible: false,
        title: '新增线路'
    })
    const [routeDrawerData, setRouteDrawerData] = useState({})
    const [routeDrawerLoading, setRouteDrawerLoading] = useState(false)
    const handleRouteDrawerOpen = (data = {}) => {
        setRouteDrawerProps({
            visible: true,
            title: '新增线路'
        })
    }
    const handleRouteDrawerClose = () => {
        setRouteDrawerProps({
            visible: false,
            title: '新增线路'
        })
        setRouteDrawerData({})
        setRouteDrawerLoading(false)
    }
    const handleRouteDrawerOk = () => {

    }

    const [addedRouteList, setAddedRouteList] = useState([2, 1])

    const randerTable = () => {
        return (
            <div>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={handleRouteDrawerOpen}>
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
                <Drawer
                    title={routeDrawerProps.title}
                    destroyOnClose
                    width={500}
                    onClose={handleRouteDrawerClose}
                    visible={routeDrawerProps.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={handleRouteDrawerOk} loading={routeDrawerLoading} type="primary" style={{ marginRight: 8 }}>
                                保存
                            </Button>
                            <Button onClick={handleRouteDrawerClose} type="primary" danger>
                                关闭
                            </Button>
                        </div>
                    }
                >
                    <Card size="small" title="基本信息(* 必填)">
                            <Form>
                                <Form.Item
                                    label="路线名"
                                >
                                    <Input width={200} placeholder="请输入品牌名称"></Input>
                                </Form.Item>
                                <Form.Item
                                    label="集配仓"
                                >
                                    <Select placeholder="请选择集配仓" style={{ width: 200 }}>
                                        <Select.Option value="1">成都集配仓</Select.Option>
                                        <Select.Option value="2">上海集配仓</Select.Option>
                                        <Select.Option value="3">南京集配仓</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card size="small" style={{marginTop: 20}} title="站点路线">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                // dataSource={addedRouteList}
                                footer={<div></div>}
                            >
                                {
                                    addedRouteList.map((item, index) => (
                                        <List.Item
                                            actions={[
                                                <DeleteOutlined className={styles.delete_icon} />
                                            ]}
                                        >
                                            <Select placeholder="请选择站点" value={item} style={{ width: 200 }}>
                                                <Select.Option value={1}>xxxxxx站点1</Select.Option>
                                                <Select.Option value={2}>xxxxxx站点2</Select.Option>
                                                <Select.Option value={3}>xxxxxx站点3</Select.Option>
                                            </Select>
                                        </List.Item>
                                    ))
                                }
                                <List.Item>
                                    <Select placeholder="请选择站点" style={{ width: 200 }}>
                                        <Select.Option value={1}>xxxxxx站点1</Select.Option>
                                        <Select.Option value={2}>xxxxxx站点2</Select.Option>
                                        <Select.Option value={3}>xxxxxx站点3</Select.Option>
                                    </Select>
                                </List.Item>
                            </List>
                        </Card>
                </Drawer>
            </div>
        )
    }
    
    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }}>
                        <Select.Option value="1">成都集配仓</Select.Option>
                        <Select.Option value="2">上海集配仓</Select.Option>
                        <Select.Option value="3">南京集配仓</Select.Option>
                    </Select>
                }
            >
                <TabPane tab="全部线路" key="1">
                    {randerTable()}
                </TabPane>
                <TabPane tab="已停用线路" key="2">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}