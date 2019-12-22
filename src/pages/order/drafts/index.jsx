import {
    Card,
    Button
} from 'antd'
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import NavLink from 'umi/navlink';

class index extends Component {
    
    render() {
        return (
            <PageHeaderWrapper>
                <Card>
                    <div>drafts</div>
                    <Button type="primary"><NavLink to="/orders/drafts_orders/new">新建订单</NavLink></Button>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default index;