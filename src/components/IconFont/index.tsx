import { createFromIconfontCN } from '@ant-design/icons';
import './iconfont.js';   // 新增：side-effect 导入，打包时执行 SVG 注入

const IconFont = createFromIconfontCN({});

export default IconFont;