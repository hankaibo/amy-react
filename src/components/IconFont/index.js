import { Icon } from 'antd';
import defaultSettings from '../../../config/defaultSettings';

const { iconfontUrl } = defaultSettings;

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});
// 使用：
// import IconFont from '@/components/IconFont';
// <IconFont type='icon-demo' className='xxx-xxx' />
export default IconFont;
