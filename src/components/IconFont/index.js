import { createFromIconfontCN } from '@ant-design/icons';
import defaultSettings from '../../../config/defaultSettings';

const { iconfontUrl } = defaultSettings;

const IconFont = createFromIconfontCN({
  scriptUrl: iconfontUrl,
});
// 使用：
// import IconFont from '@/components/IconFont';
// <IconFont type='icon-demo' className='xxx-xxx' />
export default IconFont;
