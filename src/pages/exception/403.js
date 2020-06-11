import { Button, Result } from 'antd';

import { Link, useIntl } from 'umi';
import React from 'react';

export default () => {
  const { formatMessage } = useIntl();
  return (
    <Result
      status="403"
      title="403"
      style={{
        background: 'none',
      }}
      subTitle={formatMessage({
        id: 'exceptionand403.description.403',
        defaultMessage: "Sorry, you don't have access to this page.",
      })}
      extra={
        <Link to="/">
          <Button type="primary">
            {formatMessage({ id: 'exceptionand403.exception.back', defaultMessage: 'Back Home' })}
          </Button>
        </Link>
      }
    />
  );
};
