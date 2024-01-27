import React, { useEffect, useState } from "react";

function ConversationLayout() {
  // array of the conversation data.
  const [conversations, setConversations] = useState([]);

  // initialize page. Get all conversations and fetch user data.
  useEffect(() => {}, []);

  // when a conversation gets selected we have to change the messaging window
  function handleSelectConversation() {}

  // when a new conversation gets created, call API iff the messages in that conversation is > 1.
  function handleAddConversation() {}

  return <div>Chat</div>;
}

export default ConversationLayout;
