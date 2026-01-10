import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Search, Plus } from "lucide-react";

import useChat from "@/hooks/useChat";
import useUser from "@/hooks/useUser";
import NewChatModal from "@/components/user/message/NewChatModal";
import ConversationItem from "@/components/user/message/ConversationItem";
import MessageInput from "@/components/user/message/MessageInput";
import MessageItem from "@/components/user/message/MessageItem";
import Avatar from "@/components/common/Avatar";

export default function Message() {
  const { authUser } = useOutletContext();
  const isLoggedIn = !!authUser?.id;

  const {
    conversations,
    messages,
    setMessages,
    setConversations,
    loadingConversations,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    loadConversations,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
    joinConversationRoom,
    leaveConversationRoom,
    setSelectedConversationId,
    sendDirectMessage,
  } = useChat();

  const { loadInfo } = useUser();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedOtherUser, setSelectedOtherUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetched = useRef(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const scrollBehaviorRef = useRef("auto");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!isLoggedIn || fetched.current) return;
    fetched.current = true;
    loadConversations();
  }, [isLoggedIn, loadConversations]);

  useEffect(() => {
    if (!conversations.length) return;

    const to = searchParams.get("to");
    if (!to) return;

    const conv = conversations.find((c) => c._id === to || c.target_id === to);
    if (conv) {
      setSelectedConversation(conv);
      setSelectedConversationId(conv._id);

      const otherUserId = conv.participants.find((id) => id !== authUser.id);
      if (otherUserId)
        loadInfo(otherUserId).then((res) => setSelectedOtherUser(res.user));

      scrollBehaviorRef.current = "auto";
      loadMessages(conv._id);
    } else {
      loadInfo(to).then((res) => setSelectedOtherUser(res.user));
      setSelectedConversation(null);
      setSelectedConversationId(null);
    }
  }, [
    conversations,
    searchParams,
    authUser.id,
    loadMessages,
    setSelectedConversationId,
  ]);

  useEffect(() => {
    if (!selectedConversation?._id) return;
    joinConversationRoom(selectedConversation._id);
    return () => leaveConversationRoom(selectedConversation._id);
  }, [selectedConversation?._id, joinConversationRoom, leaveConversationRoom]);

  const handleSelectConversation = async (conv, otherUser) => {
    setSelectedConversation(conv);
    setSelectedOtherUser(otherUser);
    setSelectedConversationId(conv._id);
    setSearchParams({ to: conv._id });

    scrollBehaviorRef.current = "auto";
    await loadMessages(conv._id);
  };

  const handleSendMessage = async (content) => {
    if (!selectedOtherUser) return;

    if (!selectedConversation?._id) {
      try {
        const res = await sendDirectMessage({
          receiver_id: selectedOtherUser.id,
          content,
        });

        if (!res) {
          toast.error("Gửi tin nhắn thất bại");
          return;
        }

        const { message, conversation } = res;

        if (conversation && message) {
          setSelectedConversation(conversation);
          setSelectedConversationId(conversation._id);
          setSearchParams({ to: conversation._id });

          joinConversationRoom(conversation._id);
        }

        scrollBehaviorRef.current = "auto";
      } catch (err) {
        console.error(err);
        toast.error("Gửi tin nhắn thất bại");
      }

      return;
    }

    try {
      await sendMessage({
        conversation_id: selectedConversation._id,
        content,
      });
      scrollBehaviorRef.current = "auto";
    } catch (err) {
      console.error(err);
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleCreateChat = async (targetUserId) => {
    const existingConv = conversations.find((c) =>
      c.participants.includes(targetUserId)
    );
    const { user: otherUser } = await loadInfo(targetUserId);

    if (existingConv) {
      setSelectedConversation(existingConv);
      setSelectedOtherUser(otherUser);
      setSelectedConversationId(existingConv._id);
      setSearchParams({ to: existingConv._id });

      scrollBehaviorRef.current = "auto";
      await loadMessages(existingConv._id);
    } else {
      setSelectedConversation(null);
      setSelectedOtherUser(otherUser);
      setSelectedConversationId(null);
      setSearchParams({ to: targetUserId });
    }

    setIsModalOpen(false);
  };

  useLayoutEffect(() => {
    if (scrollBehaviorRef.current !== "auto") return;
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    messagesEndRef.current.dataset.lastMessageId =
      messages[messages.length - 1]?._id || "";
  }, [messages]);

  const handleLoadMoreMessages = async () => {
    if (!selectedConversation?._id || loadingMoreMessages) return;
    const container = messagesContainerRef.current;
    if (!container) return;

    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;

    scrollBehaviorRef.current = "none";
    await loadMoreMessages(selectedConversation._id);

    setTimeout(() => {
      const scrollHeightAfter = container.scrollHeight;
      container.scrollTop =
        scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
      scrollBehaviorRef.current = "auto";
    }, 50);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!search.trim()) return true;
    return c._otherUserName?.toLowerCase().includes(search.toLowerCase());
  });

  if (!authUser)
    return (
      <div className="flex justify-center items-center py-20 text-sm text-slate-500">
        Đang tải dữ liệu tin nhắn...
      </div>
    );

  return (
    <div className="container max-w-7xl mx-auto px-4 flex gap-6 min-h-screen">
      <Toaster />

      <aside className="w-[360px] bg-white dark:bg-slate-900 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Conversations</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-md bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-slate-100 dark:bg-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConversations && (
            <p className="text-sm text-slate-500">Loading…</p>
          )}
          {!loadingConversations &&
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv._id || conv.target_id}
                conv={conv}
                authUser={authUser}
                selected={selectedConversation?._id === conv._id}
                onSelect={handleSelectConversation}
              />
            ))}
        </div>
      </aside>

      <main className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl flex flex-col">
        {!selectedConversation && selectedOtherUser ? (
          <div className="flex-1 flex flex-col">
            <div className="h-16 border-b px-6 flex items-center gap-3">
              <Avatar
                url={selectedOtherUser?.avatar_url}
                fallback={selectedOtherUser?.display_name?.[0]}
                size={40}
              />
              <p className="font-semibold">{selectedOtherUser?.display_name}</p>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-6 py-5"
            >
              <p className="text-sm text-slate-500 text-center mt-4">
                Chưa có tin nhắn, gửi tin nhắn đầu tiên để bắt đầu cuộc trò
                chuyện
              </p>
              <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={handleSendMessage} />
          </div>
        ) : selectedConversation ? (
          <>
            <div className="h-16 border-b px-6 flex items-center gap-3">
              <Avatar
                url={selectedOtherUser?.avatar_url}
                fallback={selectedOtherUser?.display_name?.[0]}
                size={40}
              />
              <p className="font-semibold">{selectedOtherUser?.display_name}</p>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              {loadingMessages && (
                <p className="text-sm text-slate-500">Loading messages…</p>
              )}

              {!loadingMessages && hasMoreMessages && (
                <div className="text-center">
                  <button
                    data-plain
                    onClick={handleLoadMoreMessages}
                    disabled={loadingMoreMessages}
                    className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 rounded-md disabled:opacity-50"
                  >
                    {loadingMoreMessages ? "Loading..." : "Load more messages"}
                  </button>
                </div>
              )}

              {!loadingMessages &&
                messages.map((msg) => (
                  <MessageItem
                    key={msg._id}
                    msg={msg}
                    isMine={msg.sender_id === authUser.id}
                    sender={
                      msg.sender_id === authUser.id ? null : selectedOtherUser
                    }
                    onDelete={deleteMessage}
                  />
                ))}

              <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a conversation to begin
          </div>
        )}
      </main>

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleCreateChat}
        authUser={authUser}
      />
    </div>
  );
}
