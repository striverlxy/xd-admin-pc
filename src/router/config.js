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
                        children: [
                            {
                                path: '/wxapp/specialPage',
                                name: '主题页配置',
                                component: lazy(() => import('../pages/wxapp/specialPage'))
                            },
                            {
                                path: '/wxapp/category',
                                name: '分类导航',
                                component: lazy(() => import('../pages/wxapp/category'))
                            },
                            {
                                path: '/wxapp',
                                redirect: '/wxapp/specialPage',
                                hidden: true
                            },
                        ]
                    },
                    {
                        path: '/product',
                        name: '商品管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/product/spuList',
                                name: '商品总库',
                                component: lazy(() => import('../pages/product/spuList'))
                            },
                            {
                                path: '/product/category',
                                name: '商品分类',
                                component: lazy(() => import('../pages/product/category'))
                            },
                            {
                                path: '/product/specifications',
                                name: '商品规格',
                                component: lazy(() => import('../pages/product/specifications')),
                                hidden: true
                            },
                            {
                                path: '/product/storeSpuList',
                                name: '集配仓商品库',
                                component: lazy(() => import('../pages/product/storeSpuList')),
                            },
                            {
                                path: '/product/chooseSpu',
                                name: '选品仓库',
                                component: lazy(() => import('../pages/product/chooseSpu')),
                            },
                            {
                                path: '/product',
                                redirect: '/product/spuList',
                                hidden: true
                            },
                        ]
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
                                path: '/warehouse/station',
                                name: '站点管理',
                                component: lazy(() => import('../pages/warehouse/station'))
                            },
                            {
                                path: '/warehouse/route',
                                name: '路线管理',
                                component: lazy(() => import('../pages/warehouse/route'))
                            },
                            {
                                path: '/warehouse',
                                redirect: '/warehouse/collect',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/order',
                        name: '订单管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/order/list',
                                name: '订单列表',
                                component: lazy(() => import('../pages/order/list'))
                            },
                            {
                                path: '/order/splitSetting',
                                name: '拆单设置',
                                component: lazy(() => import('../pages/order/splitSetting'))
                            },
                            {
                                path: '/farmer',
                                redirect: '/farmer/list',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/finance',
                        name: '财务管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/finance/splitBill',
                                name: '分账单',
                                component: lazy(() => import('../pages/finance/splitBill'))
                            },
                            {
                                path: '/finance',
                                redirect: '/finance/splitBill',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/customer',
                        name: '客户管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/customer/customerList',
                                name: '客户列表',
                                component: lazy(() => import('../pages/customer/customerList'))
                            },
                            {
                                path: '/customer',
                                redirect: '/customer/customerList',
                                hidden: true
                            }
                        ]
                    },
                    {
                        path: '/system',
                        name: '系统管理',
                        icon: <UserOutlined />,
                        children: [
                            {
                                path: '/system/optSetting',
                                name: '运营设置',
                                component: lazy(() => import('../pages/system/optSetting'))
                            },
                            {
                                path: '/system/adminUser',
                                name: '用户管理',
                                component: lazy(() => import('../pages/system/adminUser'))
                            },
                            {
                                path: '/system/role',
                                name: '角色管理',
                                component: lazy(() => import('../pages/system/role'))
                            },
                            {
                                path: '/system/organization',
                                name: '组织管理',
                                component: lazy(() => import('../pages/system/organization'))
                            },
                            {
                                path: '/system/frontPermit',
                                name: '前端页面权限',
                                component: lazy(() => import('../pages/system/frontPermit'))
                            },
                            {
                                path: '/system',
                                redirect: '/system/adminUser',
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