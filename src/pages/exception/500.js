import { Button, Result } from 'antd';

import { Link, useIntl } from 'umi';
import React from 'react';

export default () => {
  const { formatMessage } = useIntl();

  return (
    <Result
      status="500"
      title="500"
      style={{
        background: 'none',
      }}
      subTitle={formatMessage({
        id: 'exceptionand500.description.500',
        defaultMessage: 'Sorry, the server is reporting an error.',
      })}
      extra={
        <Link to="/">
          <Button type="primary">
            {formatMessage({ id: 'exceptionand500.exception.back', defaultMessage: 'Back Home' })}
          </Button>
        </Link>
      }
    />
  );
};
