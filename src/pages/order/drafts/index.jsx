import { Card } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Table from './Table';
import Button from './Button';

@connect(({ drafts }) => ({
  drafts,
}))
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
