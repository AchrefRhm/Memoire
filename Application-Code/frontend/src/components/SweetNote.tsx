"use client";
import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";
import PremiumFeatureModal from "./PremiumFeatureModal";
import { useRouter } from "next/navigation";
const PaperStyleNote = () => {
  const [activeTheme, setActiveTheme] = useState("floral");
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("My Sweet Note");
  const [showFormatting, setShowFormatting] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const divRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();
  const handlePrint = () => {
    if (divRef.current) {
      const printContents = divRef.current.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      window.location.reload();
    }
  };
  // Paper note background themes
  const themes = {
    floral: {
      bgColor: "#fffbeb", // amber-50
      pattern:
        "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      borderColor: "#d8b4fe", // purple-300
      title: "Purple Floral",
    },
    dots: {
      bgColor: "#eff6ff", // blue-50
      pattern:
        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
      borderColor: "#93c5fd", // blue-300
      title: "Blue Dots",
    },
    lines: {
      bgColor: "#f0fdf4", // green-50
      pattern:
        "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%2322c55e' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      borderColor: "#86efac", // green-300
      title: "Green Lines",
    },
    vintage: {
      bgColor: "#fff1f2", // rose-50
      pattern:
        "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f43f5e' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
      borderColor: "#fda4af", // rose-300
      title: "Rose Vintage",
    },
  };

  // Text colors
  const textColors = [
    { name: "Black", value: "#1f2937" },
    { name: "Blue", value: "#1d4ed8" },
    { name: "Red", value: "#dc2626" },
    { name: "Green", value: "#15803d" },
    { name: "Purple", value: "#7e22ce" },
    { name: "Light blue", value: "#ADD8E6" },
  ];

  // Font options
  const fontOptions = [
    { name: "Handwriting", value: "Handwriting, cursive, sans-serif" },
    { name: "Serif", value: "Georgia, Times, 'Times New Roman', serif" },
    {
      name: "Sans Serif",
      value:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    { name: "Monospace", value: "Menlo, Monaco, 'Courier New', monospace" },
  ];

  // Font size options
  const fontSizes = [
    { name: "Small", value: "14px" },
    { name: "Medium", value: "18px" },
    { name: "Large", value: "24px" },
    { name: "X-Large", value: "32px" },
  ];

  // Function to apply formatting to selected text
  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);

    // Focus back on the editor after applying format
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handler for text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setShowFormatting(true);
    }
  };

  // Click outside handler to hide formatting toolbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target)) {
        setShowFormatting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeThemeData = themes[activeTheme];
  const sanitizeText = (text) => {
    // Remove RTL markers and trim extra spaces
    return text.replace(/[\u200E\u200F]/g, "").trim();
  };

  useEffect(() => {
    if (user?.subs === "free") {
      setShowPremiumModal(true);
    }
  }, [user]);
  const handleCloseModal = () => {
    setShowPremiumModal(false);
    router.push("/"); // Redirect to home page when modal is closed
  };

  return (
    <div>
      <Header />
      <PremiumFeatureModal
        isOpen={showPremiumModal}
        onClose={() => handleCloseModal()}
        featureName="Premium Paper Styles"
        featureDescription="Upgrade to Premium to unlock all beautiful paper styles and advanced formatting options."
        ctaText="Upgrade to Premium"
        planType="premium"
      />
      <div className="flex min-h-screen flex-col">
        <div className="flex h-full flex-row">
          {/* Left sidebar with formatting tools */}
          <div className="flex w-64 flex-col space-y-6 border-r border-gray-200 bg-gray-100 p-4 dark:bg-boxdark-2 print:hidden">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Theme
              </h3>
              <div className="space-y-1">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTheme(key)}
                    className={`w-full rounded-md px-3 py-2 text-left ${
                      activeTheme === key
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    {theme.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Text Color
              </h3>
              <div className="grid grid-cols-3 gap-1">
                {textColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => applyFormatting("foreColor", color.value)}
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Font Family
              </h3>
              <div className="space-y-1">
                {fontOptions.map((font, index) => (
                  <button
                    key={index}
                    onClick={() => applyFormatting("fontName", font.value)}
                    className="w-full rounded-md px-3 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-800"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Font Size
              </h3>
              <div className="space-y-1">
                {fontSizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => applyFormatting("fontSize", index + 1)}
                    className="w-full rounded-md px-3 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    <span style={{ fontSize: size.value }}>{size.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={handlePrint}
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white shadow-md transition hover:bg-gray-900"
              >
                Print Note
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-6" ref={divRef}>
            <div
              className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg border-2 shadow-xl print:shadow-none"
              style={{
                backgroundImage: activeThemeData.pattern,
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
                backgroundColor: activeThemeData.bgColor,
                borderColor: activeThemeData.borderColor,
              }}
            >
              <div className="p-8">
                <div className="mb-6">
                  <div
                    contentEditable
                    ref={titleRef}
                    className="font-handwriting border-b-2 border-dashed border-gray-400 pb-2 text-center text-3xl outline-none"
                    onBlur={(e) => setNoteTitle(e.currentTarget.textContent)}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    suppressContentEditableWarning={true}
                  >
                    {noteTitle}
                  </div>
                </div>

                <div
                  className="bg-lined-paper min-h-64"
                  style={{
                    position: "relative",
                    padding: "16px",
                  }}
                >
                  <div
                    contentEditable
                    ref={textareaRef}
                    className="  min-h-64  w-full text-left text-lg outline-none"
                    dir="ltr"
                    style={{
                      position: "relative",
                      zIndex: 2,
                      lineHeight: "32px",
                      background: "transparent",
                      fontFamily: "Handwriting, cursive, sans-serif",
                      direction: "ltr",
                    }}
                    onBlur={(e) => setNoteText(e.currentTarget.innerHTML)}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleTextSelection}
                    placeholder="Write your notes here..."
                    dangerouslySetInnerHTML={{ __html: noteText }}
                  />

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(transparent 30px, #ccc 30px, #ccc 31px, transparent 31px)",
                      backgroundSize: "100% 32px",
                      width: "100%",
                      height: "100%",
                      top: "18px" /* Offset to align with text */,
                      left: "0",
                      zIndex: 1,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        [contentEditable] {
          direction: ltr; /* Add this line */
        }
        @media print {
          body,
          html {
            width: 100%;
            height: 100%;

            margin: 0;
            padding: 0;
            background-color: transparent !important;
          }

          /* Force background colors and images to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          @page {
            size: auto;
            margin: 15mm;
          }
        }

        [contentEditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          cursor: text;
        }

        @font-face {
          font-family: "Handwriting";
          src: local("Comic Sans MS"), local("Comic Sans");
          font-weight: normal;
          font-style: normal;
        }

        .font-handwriting {
          font-family: "Handwriting", cursive, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default PaperStyleNote;
