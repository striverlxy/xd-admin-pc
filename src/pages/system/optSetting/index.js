import { Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Tabs, Radio, message } from 'antd';
import styles from "./style.less"
import BusySetting from './components/busySetting'
import OrderSetting from './components/orderSetting'
import httpUtils from '../../../utils/request'

const { TabPane } = Tabs;

const OptSetting = () => {

    const [configList, setConfigList] = useState([])

    const getConfigList = async () => {
        let resp = await httpUtils.get('/admin/internalConfig/list', {})
        setConfigList(resp)
    }

    useEffect(() => {
        getConfigList()
    }, [])

    const updateConfig = async data => {
        await httpUtils.post('/admin/internalConfig/update', data)
        message.success('更新完成')
        getConfigList()
    }

    return (
        <div className={styles.main}>
            <Tabs defaultActiveKey="basicSettings" tabPosition="left" className={styles.tab} tabBarStyle={{width: 200}} >
                <TabPane tab="营业设置" key="basicSettings">
                    <div className={styles.right}>
                        <div className={styles.title}>营业设置</div>
                        <BusySetting configList={configList} updateConfig={updateConfig} />
                    </div>
                </TabPane>
                <TabPane tab="订单设置" key="securitySettings">
                    <div className={styles.right}>
                        <div className={styles.title}>订单设置</div>
                        <OrderSetting configList={configList} updateConfig={updateConfig} />
                    </div>
                </TabPane>
            </Tabs>
        </div>
    )
}

export default OptSetting