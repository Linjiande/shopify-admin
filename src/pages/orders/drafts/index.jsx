import { Card } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Table from './Table';
import Button from './Button';

class index extends Component {
  render() {
    return (
      <PageHeaderWrapper>
        <Card>
          <Button />
          <Table />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default index;
