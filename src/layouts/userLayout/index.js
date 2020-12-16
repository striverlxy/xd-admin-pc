import React from 'react';
import logo from '../../assets/logo.svg';
import styles from './style.less'

const UserLayout = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        {/* <Link to="/"> */}
                            {/* <img alt="logo" className={styles.logo} src={"https://img.bosszhipin.com/beijin/mcs/chatphoto/20170224/06eb96d6e2850b92a448a97342c7881f6fb09c972e38a7eee57b59d83d72ecbc.jpg?x-oss-process=image/resize,w_120,limit_0"} /> */}
                            <span className={styles.title}>安充运营管理后台</span>
                        {/* </Link> */}
                    </div>
                    {/* <div className={styles.desc}>打造全宇宙领先的一站式屏幕管理运行后台系统</div> */}
                </div>
                { children }
            </div>
            {/* <DefaultFooter /> */}
        </div>
    )
}

export default UserLayout