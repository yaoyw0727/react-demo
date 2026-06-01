/**
 * PROTOTYPE — AI 助手原型入口
 * 3 种 UI 变体，通过 ?variant=A|B|C 切换
 */
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PrototypeSwitcher } from '@/pages/prototype/PrototypeSwitcher';
import VariantA from './VariantA';
import VariantB from './VariantB';
import VariantC from './VariantC';

const VARIANTS = [
  { key: 'A', label: '百度文心风格 — 蓝色/白色/圆角气泡' },
  { key: 'B', label: '深色对话风格 — 暗色/玻璃拟态/卡片消息' },
  { key: 'C', label: '极简笔记风格 — 无边框/纯文本/Notion 风格' },
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
