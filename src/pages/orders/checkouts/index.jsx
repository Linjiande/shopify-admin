import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import Table from './Table';

@connect(({ drafts }) => ({
  drafts,
}))
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
