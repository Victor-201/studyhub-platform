import { useRef, useState, useEffect } from "react";
import {
  Upload,
  Tag,
  Globe,
  Lock,
  ChevronDown,
  FileText,
  FileImage,
  FileArchive,
  FileSpreadsheet,
  FileCode,
  XIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useDocument from "@/hooks/useDocument";
import useClickOutside from "@/hooks/useClickOutside";
import Avatar from "@/components/common/Avatar";

const TAG_REGEX = /#([^\s#]+)/g;
const TAG_TYPING_REGEX = /#([^\s#]*)$/;

/* ===== FILE ICON HELPER (CHỈ THÊM) ===== */
const getFileIcon = (file) => {
  if (!file) return FileText;

  const type = file.type;
  const name = file.name.toLowerCase();

  if (type.startsWith("image/")) return FileImage;
  if (type.includes("pdf")) return FileText;
  if (type.includes("zip") || type.includes("rar")) return FileArchive;
  if (name.endsWith(".xls") || name.endsWith(".xlsx")) return FileSpreadsheet;
  if (name.endsWith(".doc") || name.endsWith(".docx")) return FileText;
  if (name.endsWith(".ppt") || name.endsWith(".pptx")) return FileText;
  if (name.endsWith(".js") || name.endsWith(".ts")) return FileCode;

  return FileText;
};

export default function CreateDocument({
  onSuccess,
  currentUser,
  groupId = null,
}) {
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

  /* ===== CLICK OUTSIDE ĐÓNG BOX TAG ===== */
  useClickOutside(tagBoxRef, () => {
    setShowTagInput(false);
  });

  const ensureTagsLoaded = async () => {
    if (!allTags || allTags.length === 0) {
      await loadAllTags();
    }
  };

  const filterTags = (keyword) => {
    if (!keyword) return [];
    return allTags
      .filter((t) => t.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 8);
  };

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
      return `<span contenteditable="false" class="inline-flex items-center px-1.5 py-0.5 mr-0.5 rounded-md bg-blue-50 text-blue-600 text-sm font-medium">#${tag}</span>`;
    });
  };

  const insertTagIntoEditor = (tag, mode = "append") => {
    const el = editorRef.current;
    if (!el || !tag) return;

    let text = rawText;

    if (mode === "replace") {
      text = text.replace(TAG_TYPING_REGEX, `#${tag}`);
    } else {
      if (text && !text.endsWith(" ")) text += " ";
      text += `#${tag}`;
    }

    text += " ";
    setRawText(text);
    el.innerHTML = renderTextWithTags(text);
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
    } else {
      setShowSuggestions(false);
    }

    el.innerHTML = renderTextWithTags(text);
    setCaretToEnd(el);
  };

  const handleFileSelect = (f) => {
    if (!f) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(f);
    setFileUrl(URL.createObjectURL(f));
  };

  /* ===== REMOVE FILE (CHỈ THÊM) ===== */
  const removeFile = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(null);
    setFileUrl(null);
    fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => fileUrl && URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return toast.error("Vui lòng chọn file!");
    }

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
    if (groupId) formData.append("groupId", groupId);

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
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm">
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
            className="flex-1 text-lg px-2 py-1 border-none outline-none bg-transparent font-bold placeholder:font-bold"
            required
          />

          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            {visibility === "PUBLIC" ? (
              <Globe size={14} className="text-emerald-600" />
            ) : (
              <Lock size={14} className="text-rose-500" />
            )}

            <div className="relative flex items-center">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="appearance-none bg-transparent text-[13px] tracking-wide text-gray-700 cursor-pointer outline-none border-none ring-0 focus:outline-none focus:ring-0"
              >
                <option value="PUBLIC">Công khai</option>
                <option value="PRIVATE">Chỉ mình tôi</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* ===== EDITOR + TAG SUGGEST ===== */}
        <div className="relative px-4">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Nhập nội dung..."
            onInput={handleContentChange}
            className="editor min-h-[60px] px-2 py-1 rounded-lg outline-none bg-transparent"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-64 bg-white shadow-xl rounded-xl overflow-hidden">
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => insertTagIntoEditor(s, "replace")}
                  className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                >
                  #{s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== FILE PREVIEW ===== */}
        {file && (
          <div className="px-4 mt-3">
            <div className="group relative flex items-center gap-3 p-3 border rounded-xl bg-gray-50">
              {(() => {
                const Icon = getFileIcon(file);
                return <Icon size={28} className="text-blue-600" />;
              })()}

              <div className="flex-1 text-sm truncate">{file.name}</div>

              <button
                data-plain
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 hidden group-hover:flex w-6 h-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white"
              >
                <XIcon size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ===== ACTIONS ===== */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <Upload size={18} />
              File
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
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Tag size={18} />
                Tags
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
                    className="w-full p-2 text-sm rounded-lg bg-gray-50 outline-none"
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
                          className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng"}
          </button>
        </div>
      </form>
    </div>
  );
}
