import React, { useEffect, useState } from 'react'
import { Space, Button, Table, Divider, Typography, Image, message, Modal, Form, Input, Popconfirm, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'
import PicturesWall from '../../../components/picturesWall'

const borderRadius = { borderRadius: 4 }

const TopicPage = () => {

    const [topicPageList, setTopicPageList] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    useEffect(() => {
        getTopicList()
    }, [])

    const getTopicList = async () => {
        setTableLoading(true)
        let resp = await httpUtils.get('/admin/mina/topic/list')
        setTopicPageList(resp)
        setTableLoading(false)
    }

    const columns = [
        {
            title: '专题名',
            dataIndex: 'topicName',
            align: 'center',
        },
        {
            title: '专题图标',
            dataIndex: 'icon',
            align: 'center',
        },
        {
            title: '专题详情图片',
            dataIndex: 'topicPic',
            align: 'center',
            render: topicPic => <Image width={200} src={topicPic} />
        },
        {
            title: '上架状态',
            dataIndex: 'isPub',
            align: 'center',
            render: isPub => isPub ? '上架' : '下架'
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
                    <Typography.Link onClick={() => handleTopicModalOpen(record)}>编辑</Typography.Link>
                    <Popconfirm placement="topLeft" title="确定删除该主题页吗?" onConfirm={() => delTopic(record.id)} okText="确定" cancelText="取消">
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ]


    const [topicModalProps, setTopicModalProps] = useState({
        visible: false,
        title: '新增主题页'
    })
    const [topicModalData, setTopicModalData] = useState({})
    const [topicModalLoading, setTopicModalLoading] = useState(false)
    
    const handleTopicModalOpen = (data = {}) => {
        setTopicModalProps({
            visible: true,
            title: data.id ? '更新主题页': '新增主题页'
        })
        setTopicModalData(data)
    }
    const handleTopicModalClose = () => {
        setTopicModalProps({
            visible: false,
            title: '新增主题页'
        })
        setTopicModalData({})
        setTopicModalLoading(false)
    }
    const handleTopicModalOk = async () => {
        await httpUtils.post(topicModalData.id ? '/admin/mina/topic/update' : '/admin/mina/topic/add', topicModalData)
        message.success('操作完成')
        handleTopicModalClose()
        getTopicList()
    }

    const delTopic = async id => {
        await httpUtils.post(`/admin/mina/topic/${id}/del`)
        message.success('删除成功')
        getTopicList()
    }

    const saveImg = imgList => {
        console.log(imgList)
        setTopicModalData({
            ...topicModalData,
            topicPic: imgList[0]
        })
    }

    return (
        <div>
            <Space>
                <Button style={borderRadius} type="primary" size="middle" icon={<PlusOutlined />} onClick={() => handleTopicModalOpen()}>
                    新增专题页
                </Button>
            </Space>
            <Table
                size="small"
                bordered={true}
                style={{marginTop: 12}}
                columns={columns}
                rowKey={record => record.id}
                dataSource={topicPageList}
                pagination={false}
                loading={tableLoading}
            />
            <Modal
                destroyOnClose
                title={topicModalProps.title}
                visible={topicModalProps.visible}
                onOk={handleTopicModalOk}
                confirmLoading={topicModalLoading}
                onCancel={handleTopicModalClose}
            >
                <Form size="large">
                    <Form.Item
                        label="主题页名称"
                    >
                        <Input 
                            value={topicModalData.topicName} 
                            size="large" 
                            onChange={e => {
                                const { value } = e.target

                                setTopicModalData({
                                    ...topicModalData,
                                    topicName: value
                                })
                            }}  
                            placeholder="请输入主题页名称" />
                    </Form.Item>
                    <Form.Item
                        label="主题详情"
                    >
                        <PicturesWall maxCount={1} saveFileList={saveImg} />
                    </Form.Item>
                    <Form.Item
                        label="上架状态"
                    >
                        <Switch 
                            checkedChildren="上架" 
                            unCheckedChildren="下架" 
                            defaultChecked={topicModalData.isPub} 
                            onChange={e => {
                                setTopicModalData({
                                    ...topicModalData,
                                    isPub: e ? true : false
                                })
                            }} 
                        />
                    </Form.Item>
                    
                </Form>
            </Modal>
        </div>
    )
}

export default TopicPage