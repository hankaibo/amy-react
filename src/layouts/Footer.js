import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 <FormattedMessage id="app.logo.name" />
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
