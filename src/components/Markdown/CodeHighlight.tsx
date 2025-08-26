import React, { useEffect, useState } from "react";
import { Highlight } from "prism-react-renderer";
import Prism from "prismjs"; // 直接导入 Prism
import "prismjs/themes/prism-tomorrow.css"; // 加载主题
import * as Spinners from "react-spinners";
const ScaleLoader = Spinners.ScaleLoader;

interface CodeHighlightProps {
  code: string;
  language: string;
}

// 缓存已加载的语言
const loadedLanguages = new Set();

const CodeHighlight: React.FC<CodeHighlightProps> = ({ code, language }) => {
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      if (loadedLanguages.has(language)) {
        // 如果语言已经加载过，直接返回
        setIsLanguageLoaded(true);
        return;
      }

      try {
        // 加载 typescript 和 jsx 模块
        if (language === "tsx") {
          //@ts-ignore
          await import("prismjs/components/prism-typescript");
          //@ts-ignore
          await import("prismjs/components/prism-jsx");
        }
        // 动态导入所需的语言模块
        await import(`prismjs/components/prism-${language}`);
        loadedLanguages.add(language); // 将语言添加到缓存
        setIsLanguageLoaded(true);
      } catch (error) {
        console.error(`Failed to load language: ${language}`, error);
      }
    };

    loadLanguage();
  }, [language]);

  if (!isLanguageLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <ScaleLoader color="#36d7b7" height={15} loading={true} />{" "}
        {/* 使用 ScaleLoader */}
      </div>
    );
  }

  return (
    <Highlight
      code={code}
      language={language}
      prism={Prism} // 显式传递 Prism 对象
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            margin: 0,
            padding: "1em",
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeHighlight;
