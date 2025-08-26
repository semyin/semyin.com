import { Suspense, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { CodeBlockWrapper, CodeProps } from "./CodeBlockWrapper";
import "react-photo-view/dist/react-photo-view.css";
import styles from "./MarkdownRenderer.module.scss";

const ImageComponent = memo(({ src, alt }: { src?: string; alt?: string }) => {
  return (
    <PhotoView src={src} key={src}>
      <img
        src={src}
        alt={alt || ""}
        className={styles["markdown-image"]}
        loading="lazy"
      />
    </PhotoView>
  );
});

const MarkdownRenderer = ({ content }: { content: string }) => {

  return (
    <div className={styles["markdown"]}>
      <PhotoProvider
        photoClosable
        overlayRender={() => (
          <div className="react-photo-view__overlay" />
        )}
      >
        <Suspense fallback={<div>加载中...</div>}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <ImageComponent key={props.src} src={props.src} alt={props.alt} />
              ),
              code({ node, inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <CodeBlockWrapper
                    styles={styles}
                    code={String(children).replace(/\n$/, "")}
                    language={match[1]}
                  />
                ) : (
                  <code className={styles["alone-code"]} {...props}>
                    {children}
                  </code>
                );
              },
              table: ({ node, ...props }) => (
                <div className={styles["table-container"]}>
                  <table {...props} />
                </div>
              ),
              th: ({ node, ...props }) => <th style={{ textAlign: 'left' }} {...props} />,
              tr: ({ node, ...props }) => <tr {...props} />,
              td: ({ node, ...props }) => <td {...props} />,

              blockquote: ({ node, children, ...props }) => (
                <blockquote className={styles.blockquote} {...props}>
                  {children}
                </blockquote>
              ),
              li: ({ node, className, ...props }) => {
                if (className === 'task-list-item') {
                  return <li className={styles[className]} {...props} />;
                }
                return <li className={className} {...props} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </Suspense>
      </PhotoProvider>
    </div>
  );
};

export default MarkdownRenderer;
