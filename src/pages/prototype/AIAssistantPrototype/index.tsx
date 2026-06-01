/**
 * PROTOTYPE — AI 助手原型入口
 * 3 种 UI 变体，通过 ?variant=A|B|C 切换
 *
 * A: 百度文心风格 — 弹窗式，左侧侧边栏，蓝色气泡，集成到真实布局
 * B: ChatGPT 风格 — 深色主题，单列布局，顶部 Select 切换会话
 * C: Notion AI 风格 — 右侧 Drawer 滑入面板，纯文本块消息，无气泡
 */
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PrototypeSwitcher } from '@/pages/prototype/PrototypeSwitcher';
import VariantA from './VariantA';
import VariantB from './VariantB';
import VariantC from './VariantC';

const VARIANTS = [
  { key: 'A', label: '百度文心风格 — 弹窗/侧边栏/蓝色气泡' },
  { key: 'B', label: 'ChatGPT 风格 — 深色主题/单列/Select 会话切换' },
  { key: 'C', label: 'Notion AI 风格 — 右侧 Drawer/纯文本块/内嵌式' },
];

const AIAssistantPrototype: React.FC = () => {
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant') || 'A';

  return (
    <>
      {variant === 'A' && <VariantA />}
      {variant === 'B' && <VariantB />}
      {variant === 'C' && <VariantC />}
      <PrototypeSwitcher variants={VARIANTS} current={variant} />
    </>
  );
};

export default AIAssistantPrototype;
