import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React from 'react';
import { connect } from 'dva';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

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
  <span>
    <FormattedMessage id="app.copyright" />
  </span>
);

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>
                  <FormattedMessage id="app.logo.name" />
                </span>
              </Link>
            </div>
            <div className={styles.desc}>前端脚手架</div>
          </div>
          {children}
        </div>
        <DefaultFooter links={links} copyright={copyright} />
      </div>
    </>
  );
};

export default connect(({ settings }) => ({
  ...settings,
}))(UserLayout);
