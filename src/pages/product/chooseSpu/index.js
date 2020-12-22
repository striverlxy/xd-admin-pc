import React, { useState, useEffect } from 'react'
import { Tabs, Button, Table, Typography, Select, Card, Space, Input, Divider, message, Tree, Image} from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import httpUtils from '../../../utils/request'

const { Option } = Select;

const inputStyle = { width: 160, borderRadius: 4 }
const borderRadius = { borderRadius: 4 }
const { TabPane } = Tabs;

const { Meta } = Card;

const blockStyle = {
    padding: 12,
    marginTop: 12,
    background: '#fff',
    borderRadius: 4,
    marginBottom: 12,
    boxShadow: '0 2px 3px 0 rgba(0, 0, 0, .1)'
}
const ChooseSpu = () => {

    const [storeList, setStoreList] = useState([])
    const [choosedStore, setChoosedStore] = useState({})
    const getStoreList = async () => {
        let resp = await httpUtils.get('/admin/store/list')
        setStoreList(resp)
        if (resp.length > 0) {
            setChoosedStore(resp[0])
        }
    }


    const [cateTree, setCateTree] = useState([])
    const getCateTree = async () => {
        let resp = await httpUtils.get('/admin/cate/list')
        let wrap = wrapTableList(resp.children)
        setCateTree(wrap)
        console.log(wrap)
    }

    const wrapTableList = cates => {
        let temp = []
        cates.map(item => {
            let obj = {
                title: item.tree.cateName,
                key: item.tree.id
            }

            if (item.children && item.children.length > 0) {
                obj.children = wrapTableList(item.children)
            }
            temp.push(obj)
        })

        return temp
    }

    useEffect(() => {
        getCateTree()
        getStoreList()
    }, [])

    const [choosedCate, setChoosedCate] = useState({})
    const handleSelectCate = (e1, e2) => {
        if (!e2.node.children) {
            setChoosedCate(e2.node)
            getSpuList(e1[0])
        }
    }

    const [spuList, setSpuList] = useState([])
    const getSpuList = async cateId => {
        let params = {
            pageNum: 1,
            pageSize: 10000,
            cateId
        }
        let resp = await httpUtils.get('/admin/item/spu/list', params)
        setSpuList(resp.dataList)
    }  

    const getSkuList = async spuNo => {
        let resp = await httpUtils.get('/admin/item/sku/list', {spuNo: spuNo})
        let spus = spuList.slice()
        let index = spus.findIndex(s => s.spuNo == spuNo)
        spus[index].skuList = resp
        setSpuList(spus)
    }


    const attrSpan = attrJson => {
        if (attrJson != null && attrJson != undefined && attrJson != '' && attrJson != '{}') {
            let attrList = JSON.parse(attrJson)
            return (
                <Space size={0} split={<Divider type="vertical" />}>
                    {
                        attrList.map((item, index) => {
                            return (
                                <Typography.Link key={index} key={index}>{`${item.keyName}: ${item.valueName}${item.unit}`}</Typography.Link>
                            )
                        })
                    }
                </Space>
            )
        }
    }

    const [choosedSkuNo, setChoosedSkuNo] = useState('')
    const addStoreSku = async spuNo => {
        let data = {
            spuNo: spuNo,
            storeId: choosedStore.id,
            storeName: choosedStore.storeName,
            skuNo: choosedSkuNo,
            cateId: choosedCate.key
        }
        await httpUtils.post('/admin/item/optional/store/add/sku', data)
        message.success('添加成功')
    }

    const renderChooseSku = spuNo => {
        let pos = spuList.findIndex(s => s.spuNo == spuNo)
        let renderBlock = [
            <Space>
                <Select onFocus={() => getSkuList(spuNo)} style={inputStyle} placeholder="请点选商品" defaultValue={choosedSkuNo} onChange={e => setChoosedSkuNo(e)}>
                    {
                        (pos > -1 && spuList[pos].skuList) ? spuList[pos].skuList.map((item, index) => (
                            <Select.Option value={item.skuNo} key={index}>{attrSpan(item.attrJson)}</Select.Option>
                        )) : <Select.Option></Select.Option>
                    }
                </Select>
                <Typography.Link onClick={() => addStoreSku(spuNo)}>添加</Typography.Link>
            </Space>
        ]
        return renderBlock
    }

    const randerTable = () => {
        return (
            <Space align="start">
                <Card size="small" title="全部商品" style={{width: 300}}>
                    <Tree
                        onSelect={handleSelectCate}
                        treeData={cateTree}
                    />
                </Card>
                <Card size="small" title={choosedCate.title ? `【${choosedCate.title}】分类下的商品列表` : '请点选左侧分类'} style={{width: '100%'}}>
                    <Space size={16} wrap>
                        {
                            spuList.map((item, index) => (
                                <Card
                                    key={index}
                                    hoverable
                                    style={{ width: 240 }}
                                    cover={
                                        <div style={{height: 150, overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
                                            <Image
                                                width={200}
                                                src={item.bannerUrls[0]}
                                            />
                                        </div>
                                    }
                                    actions={renderChooseSku(item.spuNo)}
                                >
                                    <Meta title={item.spuName} />
                                </Card>
                            ))
                        }
                    </Space>
                
                </Card>
            </Space>
        )
    }


    return (
        <div style={blockStyle}>
            <Tabs 
                tabBarExtraContent={
                    <Select placeholder="请选择集配仓" style={{ width: 200 }} value={choosedStore.id}>
                        {
                            storeList.map((item, index) => (
                                <Select.Option value={item.id} key={index}>{item.storeName}</Select.Option>
                            ))
                        }
                    </Select>
                }
            >
                <TabPane tab="挑选供货商品" key="1">
                    {randerTable()}
                </TabPane>
            </Tabs>
        </div>
    )
}

export default ChooseSpu