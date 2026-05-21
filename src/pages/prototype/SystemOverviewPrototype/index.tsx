/**
 * PROTOTYPE — 系统概览页面原型
 * 3 种布局变体通过 ?variant= 切换
 * 
 * Variant A — 经典仪表盘：卡片顶部 4 列，图表 2x2 网格，仪表盘底部横排
 * Variant B — 左右分栏：左侧大图表区，右侧卡片+仪表盘垂直堆叠
 * Variant C — Tab 整合：所有模块整合为一个大卡片，内部用 Tab 切换
 */
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { VariantA } from './VariantA';
import { VariantB } from './VariantB';
import { VariantC } from './VariantC';
import { PrototypeSwitcher } from '../PrototypeSwitcher';

const variants = [
  { key: 'A', label: '经典仪表盘' },
  { key: 'B', label: '左右分栏' },
  { key: 'C', label: 'Tab 整合' },
];

const SystemOverviewPrototype: React.FC = () => {
  const [searchParams] = useSearchParams();
  const variant = searchParams.get('variant') ?? 'A';

  return (
    <>
      {variant === 'A' && <VariantA />}
      {variant === 'B' && <VariantB />}
      {variant === 'C' && <VariantC />}
      <PrototypeSwitcher variants={variants} current={variant} />
    </>
  );
};

export default SystemOverviewPrototype;
