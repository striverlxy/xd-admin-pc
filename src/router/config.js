import React, {lazy} from 'react'
import { WechatOutlined, UserOutlined, ShopOutlined, LineChartOutlined, MonitorOutlined } from '@ant-design/icons';
import BlankLayout from '../layouts/blankLayout'
import BasicLayout from '../layouts/basicLayout'
import UserLayout from '../layouts/userLayout'

const router = [
    {
        path: '/',
        component: BlankLayout,
        children: [
            {
                path: '/user',
                component: UserLayout,
                children: [
                    {
                        path: '/user/login',
                        name: '登陆',
                        component: lazy(() => import('../pages/user/login'))
                    },
                    {
                        path: '/user',
                        redirect: '/user/login',
                        hidden: true
                    },
                ]
            },
            {
                path: '/',
                component: BasicLayout,
                children: [
                    {
                        path: '/home',
                        name: '首页',
                        icon: <WechatOutlined />,
                        component: lazy(() => import('../pages/home'))
                    },
                    {
                        path: '/wxapp',
                        name: '小程序管理',
                        icon: <WechatOutlined />,
                        component: lazy(() => import('../pages/home'))
                    },
                    {
                        path: '/farmer',
                        name: '农户管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/farmer/list',
                                name: '农户列表',
                                component: lazy(() => import('../pages/farmer/list'))
                            },
                            {
                                path: '/farmer',
                                redirect: '/farmer/list',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/warehouse',
                        name: '仓库管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/warehouse/collect',
                                name: '集采单管理',
                                component: lazy(() => import('../pages/warehouse/collect'))
                            },
                            {
                                path: '/warehouse/inbound',
                                name: '入库管理',
                                component: lazy(() => import('../pages/warehouse/inbound'))
                            },
                            {
                                path: '/warehouse/sowing',
                                name: '播种管理',
                                component: lazy(() => import('../pages/warehouse/sowing'))
                            },
                            {
                                path: '/warehouse/sorting',
                                name: '分拣管理',
                                component: lazy(() => import('../pages/warehouse/sorting'))
                            },
                            {
                                path: '/warehouse/outbound',
                                name: '出库管理',
                                component: lazy(() => import('../pages/warehouse/outbound'))
                            },
                            {
                                path: '/warehouse/driver',
                                name: '司机管理',
                                component: lazy(() => import('../pages/warehouse/driver'))
                            },
                            {
                                path: '/warehouse/truck',
                                name: '货车管理',
                                component: lazy(() => import('../pages/warehouse/truck'))
                            },
                            {
                                path: '/warehouse',
                                redirect: '/warehouse/collect',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/404',
                        name: '404',
                        hidden: true,
                        component: lazy(() => import('../pages/exception/pageNotFound'))
                    },
                    { path: '/', exact: true, redirect: '/home', hidden: true},
                    { path: '*', exact: true, redirect: '/404', hidden: true },
                ]
            }
        ]
    }
]

export default router