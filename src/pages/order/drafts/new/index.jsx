import {
    Card,
} from 'antd'
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

class index extends Component {
    
    render() {
        return (
            <PageHeaderWrapper>
                <Card>
                    <div>创建订单</div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default index;