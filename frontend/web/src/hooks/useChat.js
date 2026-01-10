import { useState, useEffect, useCallback } from "react";
import chatService from "@/services/chatService";
import useSocket from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";

export default function useChat() {
  const { user: authUser } = useAuth();

  /* ================= STATE ================= */
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [pendingMessages, setPendingMessages] = useState({});

  /* ================= SOCKET ================= */
  const { emit, on, off, connected } = useSocket();

  /* ================= LOAD ================= */
  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const res = await chatService.getConversations({
        limit: 50,
        offset: 0,
      });
      setConversations(res.data?.data || []);
    } catch (err) {
      console.error("Load conversations error:", err);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    setLoadingMessages(true);
    try {
      const res = await chatService.getMessages(conversationId, {
        limit: 20,
        before: null,
      });

      const data = res.data?.data || [];

      setMessages(
        data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      );

      setHasMoreMessages(data.length === 20);

      // merge pending messages
      setPendingMessages((prev) => {
        const pending = prev[conversationId];
        if (!pending?.length) return prev;

        setMessages((msgs) => {
          const merged = [...msgs, ...pending].filter(
            (m, i, arr) => arr.findIndex((x) => x._id === m._id) === i
          );
          return merged.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        });

        const clone = { ...prev };
        delete clone[conversationId];
        return clone;
      });
    } catch (err) {
      console.error("Load messages error:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const loadMoreMessages = async (conversationId) => {
    if (!hasMoreMessages || loadingMoreMessages) return;

    setLoadingMoreMessages(true);
    try {
      const before = messages[0]?.created_at;
      const res = await chatService.getMessages(conversationId, {
        limit: 20,
        before,
      });

      const data = res.data?.data || [];
      setMessages((prev) =>
        [...data, ...prev].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      );
      setHasMoreMessages(data.length === 20);
    } catch (err) {
      console.error("Load more messages error:", err);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!authUser || !connected) return;

    const handleReceiveMessage = (message) => {
      if (message.conversation_id === selectedConversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;

          const tempIndex = prev.findIndex(
            (m) =>
              m._id?.startsWith("temp-") &&
              m.sender_id === message.sender_id &&
              m.content === message.content
          );

          if (tempIndex !== -1) {
            const clone = [...prev];
            clone[tempIndex] = message;
            return clone;
          }

          return [...prev, message];
        });
      } else {
        setPendingMessages((prev) => ({
          ...prev,
          [message.conversation_id]: [
            ...(prev[message.conversation_id] || []),
            message,
          ].filter((m, i, arr) => arr.findIndex((x) => x._id === m._id) === i),
        }));
      }
    };

    const handleConversationUpdate = () => {
      loadConversations();
    };

    on("receive_message", handleReceiveMessage);
    on("conversation_update", handleConversationUpdate);

    return () => {
      off("receive_message", handleReceiveMessage);
      off("conversation_update", handleConversationUpdate);
    };
  }, [authUser, connected, selectedConversationId, loadConversations, on, off]);

  /* ================= ROOM ================= */
  const joinConversationRoom = (id) => emit("join_conversation", id);
  const leaveConversationRoom = (id) => emit("leave_conversation", id);

  /* ================= SEND ================= */
  const sendMessage = async ({ conversation_id, content, type = "text" }) => {
    if (!authUser) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender_id: authUser.id,
      conversation_id,
      content,
      type,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    emit("send_message", { conversation_id, content, type });
  };

  const sendDirectMessage = async ({ receiver_id, content, type = "text" }) => {
    if (!authUser) return null;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender_id: authUser.id,
      conversation_id: `direct-${receiver_id}`,
      content,
      type,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await chatService.sendDirectMessage({
        receiver_id,
        content,
        type,
      });

      if (!res?.data?.success || !res.data.data) return tempMessage;

      const { message, conversation } = res.data.data;

      emit("send_message", message);

      setMessages((prev) => {
        const idx = prev.findIndex((m) => m._id === tempMessage._id);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = message;
          return clone;
        }
        return [...prev, message];
      });

      if (conversation) {
        setConversations((prev) => {
          if (!prev.some((c) => c._id === conversation._id)) {
            return [conversation, ...prev];
          }
          return prev.map((c) =>
            c._id === conversation._id ? conversation : c
          );
        });
      }

      return { message, conversation };
    } catch (err) {
      console.error("Send direct message error:", err);
      return tempMessage;
    }
  };

  const createConversation = async ({ type, target_id, participant_ids }) => {
    try {
      const res = await chatService.createConversation({
        type,
        target_id,
        participant_ids,
      });
      if (res.data?.success) {
        await loadConversations();
        return res.data.data;
      }
    } catch (err) {
      console.error("Create conversation error:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    const res = await chatService.deleteMessage(messageId);
    if (res.data?.success) {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      return true;
    }
    return false;
  };

  return {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,

    setConversations,
    loadConversations,
    loadMessages,
    loadMoreMessages,

    sendMessage,
    sendDirectMessage,
    createConversation,
    deleteMessage,

    joinConversationRoom,
    leaveConversationRoom,
    setSelectedConversationId,
  };
}
