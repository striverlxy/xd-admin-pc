import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, DatePicker, Divider} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const { Option } = Select;
const { RangePicker } = DatePicker;
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

export default function OrderList() {

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
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 200
    })
    const [tableLoading, setTableLoading] = useState(false)

    const getOrderList = async (pagination = {pageSize: 10, current: 1}) => {
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/order/page', params)
        setData(resp)
        setTableLoading(false)
    }

    useEffect(() => {
        getStoreList()
        getOrderList()
    }, [])

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '订单号',
            dataIndex: 'orderNo',
            align: 'center',
            width: 200
        },
        {
            title: '下单日期',
            dataIndex: 'orderTime',
            align: 'center',
            width: 160
        },
        {
            title: '所属集配仓',
            dataIndex: 'storeName',
            align: 'center',
        },
        {
            title: '所属站点',
            dataIndex: 'siteId',
            align: 'center',
        },
        {
            title: '订单金额',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '配送方式',
            dataIndex: 'deliveryType',
            align: 'center',
            render: deliveryType => deliveryType == 1 ? '自提': '送货上门'
        },
        {
            title: '支付方式',
            dataIndex: 'payType',
            align: 'center',
        },
        {
            title: '收货人',
            dataIndex: 'receiverName',
            align: 'center',
        },
        {
            title: '手机',
            dataIndex: 'receiverPhone',
            align: 'center',
        },
        {
            title: '收获地址',
            dataIndex: 'receiverAddress',
            align: 'center',
        },
        {
            title: '备注',
            dataIndex: 'note',
            align: 'center',
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>详情</Typography.Link>
                    <Typography.Link type="danger">改单</Typography.Link>
                    <Typography.Link type="danger">退款</Typography.Link>
                </Space>
            )
        }
    ];

    const randerTable = () => {
        return (
            <div>
                <Card size="small" title="数据检索" extra={
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
                        placeholder="订单编号" 
                        allowClear 
                    />
                    <Select
                        size="middle"
                        style={inputStyle}
                        placeholder="订单状态"
                        allowClear 
                    >
                        <Option value="1">农户1</Option>
                        <Option value="2">农户2</Option>
                    </Select>
                    <Select
                        size="middle"
                        style={inputStyle}
                        placeholder="站点"
                        allowClear 
                    >
                        <Option value="1">农户1</Option>
                        <Option value="2">农户2</Option>
                    </Select>
                    <RangePicker style={borderRadius} size="middle" showTime={false} />
                    <Input 
                        style={inputStyle} 
                        size="middle" 
                        placeholder="收货人姓名" 
                        allowClear 
                    />
                    <Input 
                        style={inputStyle} 
                        size="middle" 
                        placeholder="手机号码" 
                        allowClear 
                    />
                </Space>
            </Card>
            <Space>
                <Button style={borderRadius} type="primary" size="middle">
                    批量打印
                </Button>
            </Space>
            <Table
                size="small"
                scroll={{ x: 2000 }}
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={data.dataList}
                pagination={{
                    total: data.totalCount
                }}
                loading={tableLoading}
                onChange={async (pagination, filters, sorter) => getOrderList(pagination)}
            />
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
                <TabPane tab="订单管理" key="1">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}