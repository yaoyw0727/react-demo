import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyOutlined, CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { Components } from 'react-markdown';
import styles from './index.module.less';

interface Props {
  content: string;
}

const CodeBlock: Components['code'] = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (match) {
    return (
      <div className={styles.codeBlock}>
        <div className={styles.codeHeader}>
          <span className={styles.codeLang}>{match[1]}</span>
          <div className={styles.codeActions}>
            <button className={styles.iconBtn} onClick={handleCopy} title="复制代码">
              {copied ? <CheckOutlined /> : <CopyOutlined />}
            </button>
            <button className={styles.iconBtn} onClick={() => setCollapsed(!collapsed)} title={collapsed ? '展开代码块' : '折叠代码块'}>
              {collapsed ? <DownOutlined /> : <UpOutlined />}
            </button>
          </div>
        </div>
        {!collapsed && (
          <SyntaxHighlighter
            language={match[1]}
            style={oneLight}
            showLineNumbers
            lineNumberStyle={{ fontStyle: 'normal', minWidth: '2.5em' }}
            customStyle={{ margin: 0, border: 'none', borderRadius: 0, fontSize: '13px', lineHeight: 1.8 }}
            codeTagProps={{ style: { fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace" } }}
          >
            {codeText}
          </SyntaxHighlighter>
        )}
      </div>
    );
  }
  return <code className={styles.inlineCode} {...props}>{children}</code>;
};
function MarkdownRendererBase({ content }: Props) {

  const components: Components = {
    code: CodeBlock,
    table: ({ children }) => <div className={styles.tableWrap}><table className={styles.table}>{children}</table></div>,
    th: ({ children }) => <th className={styles.tableTh}>{children}</th>,
    td: ({ children }) => <td className={styles.tableTd}>{children}</td>,
    a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className={styles.link}>{children}</a>,
    img: ({ src, alt }) => <img src={src} alt={alt} className={styles.image} loading="lazy" />,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

const MarkdownRenderer = React.memo(MarkdownRendererBase);

export default MarkdownRenderer;
