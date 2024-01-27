import React, { useEffect } from "react";

// 2 states. When messages array is empty and when messages array is not.
function MessageWindow() {
  useEffect(() => {
    // if messages array empty, show start chat, else: load messages
  }, []);

  return <div>MessageWindow</div>;
}

export default MessageWindow;
