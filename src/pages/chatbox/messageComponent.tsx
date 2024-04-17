import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/util/supabase";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex, { Options } from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import { useTheme } from "@/util/themeprovider";

type MessageComponentProps = {
  message?: Tables<"Messages">;
  isLoading?: boolean;
};

function formatDateString(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const { theme } = useTheme();
  const dateConversion = formatDateString(message!.created_at);
  return (
    <div className="py-2">
      <div id="header" className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          {message!.role == "assistant" ? "Assistant" : "You"}
        </div>
        <div className="text-gray-500 text-xs font-medium">
          {formatDateString(dateConversion)}
        </div>
      </div>
      <div id="content-container" className="flex">
        <Skeleton className=" animate-none  h-auto p-[0.10rem] " />
        <div id="content" className="ml-4 md:max-w-full">
          <Markdown
            children={message!.content}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <div>
                    <div className="w-[90vw] md:w-full">
                      <SyntaxHighlighter
                        CodeTag={"div"}
                        wrapLongLines
                        showLineNumbers
                        PreTag="div"
                        children={String(children).replace(/\n$/, "")}
                        language={match[1]}
                        style={theme === "dark" ? oneDark : oneLight}
                      />
                      <div className="text-sm pb-4">{match[1]}</div>
                    </div>
                  </div>
                ) : (
                  <code {...rest} className="bg-background text-wrap">
                    {children}
                  </code>
                );
              },
              p(props) {
                return <p className="text-wrap pb-4" {...props} />;
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default MessageComponent;
