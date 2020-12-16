import React, { useState, useEffect } from 'react'
import { Input, Select, Button, DatePicker, Table, Space, Card, Typography, Divider } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

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

const AdminUser = () => {

    const [adminUserList, setAdminUser] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const columns = [
        {
            title: '序号',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '用户ID',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '登录账号',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '姓名',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '手机',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '角色',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '组织',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '账户状态',
            dataIndex: 'orderNo',
            align: 'center'
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => (
                <Space size={0} split={<Divider type="vertical" />}>
                    <Typography.Link>编辑</Typography.Link>
                    <Typography.Link type="danger">删除</Typography.Link>
                    <Typography.Link type="danger">停用/启用</Typography.Link>
                </Space>
            )
        }
    ]

    return (
        <div>
            <Card 
                size="small"
                title="数据检索" 
                extra={
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
                        placeholder="请输入序列号" 
                        allowClear 
                    />
                    <RangePicker size="middle" />
                </Space>
            </Card>
            <div style={blockStyle}>
                <Space>
                    <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />}>
                        添加
                    </Button>
                </Space>
                <Table
                    size="small"
                    bordered={true}
                    style={{marginTop: 12}}
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={adminUserList}
                    pagination={{
                        total: 100
                    }}
                    loading={tableLoading}
                    // onChange={async (pagination, filters, sorter) => handleTableChange(pagination)}
                />
            </div>
        </div>
    )
}

export default AdminUser