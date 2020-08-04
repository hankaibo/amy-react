import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SelectLang, connect, Link, useIntl } from 'umi';
import React from 'react';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const { formatMessage } = useIntl();
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
    <HelmetProvider>
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
                <div className={styles.logo}>
                  <div className={styles.h} />
                  <div className={styles.h} />
                </div>
                {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                <span className={styles.title}>{formatMessage({ id: 'app.logo.name' })}</span>
              </Link>
            </div>
            <div className={styles.desc}>前端脚手架</div>
          </div>
          {children}
        </div>
        <DefaultFooter
          links={[
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
          ]}
          copyright={formatMessage({ id: 'app.copyright' })}
        />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({
  ...settings,
}))(UserLayout);
