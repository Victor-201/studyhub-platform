import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Tag,
  Globe,
  Lock,
  ChevronDown,
  XIcon,
  Users,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useDocument from "@/hooks/useDocument";
import useClickOutside from "@/hooks/useClickOutside";
import Avatar from "@/components/common/Avatar";
import { motion, AnimatePresence } from "framer-motion";

import docIcon from "@/assets/icons/doc.png";
import pdfIcon from "@/assets/icons/pdf.png";
import pptIcon from "@/assets/icons/ppt.png";
import xlsIcon from "@/assets/icons/xls.png";
import jsonIcon from "@/assets/icons/json.png";
import imgIcon from "@/assets/icons/img.png";
import videoIcon from "@/assets/icons/video.png";
import zipIcon from "@/assets/icons/zip.png";

const fileIcons = {
  doc: docIcon,
  docx: docIcon,
  pdf: pdfIcon,
  ppt: pptIcon,
  pptx: pptIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  json: jsonIcon,
  png: imgIcon,
  jpg: imgIcon,
  jpeg: imgIcon,
  gif: imgIcon,
  mp4: videoIcon,
  mov: videoIcon,
  zip: zipIcon,
};

const TAG_REGEX = /#([^\s#]+)/g;
const TAG_TYPING_REGEX = /#([^\s#]*)$/;

export default function CreateDocument({
  onSuccess,
  currentUser,
  groupId = null,
}) {
  console.log("Render CreateDocument", { groupId });
  const { uploadDocument, loadAllTags, allTags, loading } = useDocument();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const tagBoxRef = useRef(null);

  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [visibility, setVisibility] = useState("PUBLIC");

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useClickOutside(tagBoxRef, () => setShowTagInput(false));

  useEffect(() => {
    if (groupId) {
      setVisibility("GROUP");
    }
  }, [groupId]);

  const ensureTagsLoaded = async () => {
    if (!allTags || allTags.length === 0) await loadAllTags();
  };

  const filterTags = (keyword) =>
    keyword
      ? allTags
          .filter((t) => t.toLowerCase().includes(keyword.toLowerCase()))
          .slice(0, 8)
      : [];

  const setCaretToEnd = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const renderTextWithTags = (text) => {
    if (!text) return "";
    return text.replace(TAG_REGEX, (_, tag) => {
      return `<span contenteditable="false" class="inline-flex items-center px-2 py-0.5 mr-1 rounded-md bg-blue-50 text-blue-600 text-sm font-medium">#${tag}</span>`;
    });
  };

  const insertTagIntoEditor = (tag, mode = "append") => {
    const el = editorRef.current;
    if (!el || !tag) return;

    let text = rawText;
    if (mode === "replace") text = text.replace(TAG_TYPING_REGEX, `#${tag}`);
    else text += (text && !text.endsWith(" ") ? " " : "") + `#${tag}`;

    setRawText(text + " ");
    el.innerHTML = renderTextWithTags(text + " ");
    setCaretToEnd(el);
    setShowSuggestions(false);
  };

  const handleContentChange = async () => {
    const el = editorRef.current;
    if (!el) return;

    const text = el.innerText;
    setRawText(text);

    const typingMatch = text.match(TAG_TYPING_REGEX);
    if (typingMatch) {
      const keyword = typingMatch[1];
      await ensureTagsLoaded();
      setSuggestions(filterTags(keyword));
      setShowSuggestions(true);
    } else setShowSuggestions(false);

    el.innerHTML = renderTextWithTags(text);
    setCaretToEnd(el);
  };

  const handleFileSelect = (f) => {
    if (!f) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(f);
    setFileUrl(URL.createObjectURL(f));
  };

  const removeFile = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(null);
    setFileUrl(null);
    fileInputRef.current.value = "";
  };

  useEffect(() => () => fileUrl && URL.revokeObjectURL(fileUrl), [fileUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Vui lòng chọn file!");

    const tags = [...rawText.matchAll(TAG_REGEX)].map((m) => m[1]);
    const description = rawText
      .replace(TAG_REGEX, "")
      .replace(/\s+/g, " ")
      .trim();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("visibility", visibility);
    tags.forEach((t) => formData.append("tags[]", t));
    if (groupId) formData.append("group_id", groupId);

    try {
      await uploadDocument(formData);
      toast.success("Tạo document thành công!");
      setTitle("");
      setRawText("");
      removeFile();
      if (editorRef.current) editorRef.current.innerHTML = "";
      onSuccess?.();
    } catch {
      toast.error("Tạo document thất bại!");
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Overlay loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-blue-600"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.div
        key="form"
        initial={{ opacity: 0, y: 15, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-lg overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 p-4">
            <Avatar
              size={40}
              url={currentUser?.user.avatar_url}
              fallback={currentUser?.user.display_name?.[0] || "U"}
            />
            <input
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-lg px-3 py-2 border-none outline-none bg-gray-50 rounded-lg font-bold placeholder:font-bold"
              required
            />
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
              {visibility === "PUBLIC" ? (
                <Globe size={14} className="text-emerald-600" />
              ) : visibility === "PRIVATE" ? (
                <Lock size={14} className="text-rose-500" />
              ) : (
                <User size={14} className="text-blue-600" />
              )}

              {groupId ? (
                <div className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-500">
                  Nhóm
                </div>
              ) : (
                <div className="relative flex items-center">
                  <select
                    data-plain
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="
    appearance-none
    bg-transparent
    text-sm
    px-3 py-1 pr-6
    rounded-lg
    cursor-pointer
    hover:bg-gray-200 dark:hover:bg-gray-600
    focus:outline-none
    border-none
  "
                  >
                    <option value="PUBLIC">Công khai</option>
                    <option value="PRIVATE">Chỉ mình tôi</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-2 text-gray-400 pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="relative px-4">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Nhập nội dung..."
              onInput={handleContentChange}
              className="editor min-h-[60px] px-3 py-2 rounded-xl outline-none bg-gray-50 transition-all duration-200 hover:shadow-md"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-64 bg-white shadow-xl rounded-xl overflow-hidden">
                {suggestions.map((s) => (
                  <div
                    key={s}
                    onClick={() => insertTagIntoEditor(s, "replace")}
                    className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    #{s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File preview */}
          {file && (
            <motion.div
              className="px-4 mt-3"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:shadow-md transition-shadow duration-200">
                {(() => {
                  const ext = file.name.split(".").pop().toLowerCase();
                  const IconSrc = fileIcons[ext] || docIcon;
                  return <img src={IconSrc} alt={ext} className="w-8 h-8" />;
                })()}
                <div className="flex-1 text-sm truncate">{file.name}</div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <XIcon size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Upload size={18} /> File
              </button>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              <div className="relative">
                <button
                  type="button"
                  onClick={async () => {
                    await ensureTagsLoaded();
                    setShowTagInput(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Tag size={18} /> Tags
                </button>
                {showTagInput && (
                  <div
                    ref={tagBoxRef}
                    className="absolute bottom-full left-0 mb-2 w-64 bg-white shadow-xl rounded-xl p-2 z-50"
                  >
                    <input
                      autoFocus
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setSuggestions(filterTags(e.target.value));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          insertTagIntoEditor(tagInput, "append");
                          setTagInput("");
                          setShowTagInput(false);
                        }
                      }}
                      placeholder="Nhập tag..."
                      className="w-full p-2 text-sm rounded-lg bg-gray-50 outline-none transition-shadow duration-200 focus:shadow-md"
                    />
                    {suggestions.length > 0 && (
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        {suggestions.map((s) => (
                          <div
                            key={s}
                            onClick={() => {
                              insertTagIntoEditor(s, "append");
                              setTagInput("");
                              setShowTagInput(false);
                            }}
                            className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded transition-colors"
                          >
                            #{s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Đang xử lý..." : "Đăng"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
