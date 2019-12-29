import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import NavLink from 'umi/navlink';

export default () => (
  <div className={styles.container}>
    <div id="components-button-demo-basic">
      <div>
        <Button type="primary">
          <NavLink to="/orders/drafts_orders/new">创建订单</NavLink>
        </Button>
      </div>
    </div>
  </div>
);
