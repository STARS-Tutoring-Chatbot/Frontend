import { Tables } from "@/util/supabase";
import React, { useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
  vs,
  vscDarkPlus,
  materialLight,
  materialDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

type MessageComponentProps = {
  message: Tables<"Messages">;
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
  const dateConversion = formatDateString(message.created_at);

  const [codeTheme, setCodeTheme] = useState(oneDark);

  return (
    <div className="py-2 w-full">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          {message.role == "assistant" ? "Assistant" : "You"}
        </div>
        <div className="text-gray-500 text-xs font-medium">
          {formatDateString(dateConversion)}
        </div>
      </div>
      <div className="message-content">
        <Markdown
          className="w-full"
          children={message.content}
          components={{
            div(props) {
              const { children, ...rest } = props;
              return (
                <div className="w-full" {...rest}>
                  {children}
                </div>
              );
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <>
                  <SyntaxHighlighter
                    CodeTag={"div"}
                    wrapLongLines
                    showLineNumbers
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={oneDark}
                  />
                  <div className="text-gray-500 text-sm pb-4">{match[1]}</div>
                </>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default MessageComponent;
