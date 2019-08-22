import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import getPageTitle from '@/utils/getPageTitle';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <>
    Copyright <Icon type="copyright" /> 2019 <FormattedMessage id="app.copyright" />
  </>
);

const UserLayout = props => {
  const {
    children,
    location: { pathname },
    breadcrumbNameMap,
  } = props;
  return (
    <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>FE</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
        <GlobalFooter links={links} copyright={copyright} />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ user: menuModel }) => ({
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
