import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import AppRouter from '../src/router'
import 'moment/locale/zh-cn';

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AppRouter />
    </ConfigProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
