import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-2xl !mt-6 !mb-6"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded"
                {...props}
              >
                {children}
              </code>
            );
          },
          img({ ...props }) {
            return (
              <img
                {...props}
                className="rounded-3xl my-10 shadow-xl"
                alt={props.alt || ''}
              />
            );
          },
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-12 mb-6 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-10 mb-5">{children}</h2>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
