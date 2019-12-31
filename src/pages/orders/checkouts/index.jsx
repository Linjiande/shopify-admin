import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import Table from './Table';

class index extends Component {
  render() {
    return (
      <PageHeaderWrapper>
        <Card>
          <Table />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default index;
