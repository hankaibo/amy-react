import { Button, Result } from 'antd';

import { Link } from 'umi';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';

export default () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle={formatMessage({
      id: 'exceptionand404.description.404',
      defaultMessage: "Sorry, you don't have access to this page.",
    })}
    extra={
      <Link to="/">
        <Button type="primary">
          {formatMessage({ id: 'exceptionand404.exception.back', defaultMessage: 'Back Home' })}
        </Button>
      </Link>
    }
  />
);
