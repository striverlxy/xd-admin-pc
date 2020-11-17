import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import httpUtil from '../../../utils/request'

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const WarningInfo = () => {

    const history = useHistory();

    const [data, setData] = useState({})
    const [queryCondition, setQueryCondition] = useState({
        orderNo: '',
        orderType: '',
        orderStatus: ''
    })
    
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // getOrderList()
    }, ["", queryCondition])

    const getOrderList = async (pagination = {pageSize: 10, current: 1}) => {
        // setLoading(true)
        // let params = {
        //     orderNo: queryCondition.orderNo != undefined ? queryCondition.orderNo : '',
        //     orderStatus: queryCondition.orderStatus != undefined ? queryCondition.orderStatus : '',
        //     pageSize: pagination.pageSize,
        //     pageNum: pagination.current
        // }
        // let resp = await httpUtil.get('/order/list', params)
        
        // setLoading(false)
        // setData(resp)
    }

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination) 
        console.log(filters)
        console.log(sorter)
    }

    const gotoOrderDetail = order => {
        history.push('/order/detail', {
            orderNo: order.orderNo
        })
    }

    const columns = [
        {
            title: '告警时间',
            dataIndex: 'orderNo',
            align: 'center',
            sorter: true,
        },
        {
            title: '告警类型',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
        },
        {
            title: '序列号',
            dataIndex: 'totalAmount',
            align: 'center',
            sorter: true,
        },
        {
            title: '代理商',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '物业',
            dataIndex: 'totalAmount',
            align: 'center',
        },
        {
            title: '告警详情',
            dataIndex: 'totalAmount',
            align: 'center',
        }
    ];

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
                    <Select
                        size="large"
                        style={borderRadius}
                        placeholder="请选择告警类型"
                        allowClear 
                        onChange={e => setQueryCondition({...queryCondition, orderStatus: e})}
                    >
                        <Option value="1">待付款</Option>
                        <Option value="2">付款成功</Option>
                        <Option value="3">付款失败</Option>
                    </Select>
                    <RangePicker size="large" />
                </Space>
            </Card>
            <div style={blockStyle}>
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
                    onChange={async (pagination, filters, sorter) => handleTableChange(pagination)}
                />
            </div>
        </div>
    )
}

export default WarningInfo