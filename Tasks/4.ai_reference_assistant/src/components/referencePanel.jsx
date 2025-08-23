"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, FileText, Link, Type, AlertCircle } from "lucide-react";
import axios from "axios";

export default function ReferencePanel({ userUsername, onReferencesChange }) {
  const [references, setReferences] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const addTextReference = async () => {
    if (!textContent.trim()) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/add-text-reference", {
        method: "POST",
        body: JSON.stringify({
          content: textContent.trim(),
          username: userUsername,
        }),
      });

      const data = await res.json();

      if (data.success) {
        fetchReferences();
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
        setError(data.error);
      }
      setTextContent("");
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed To Add Text Reference");
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;
    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("username", userUsername);
    setIsProcessing(true);
    setError(null);

    const res = await fetch("/api/uploadPDF", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      fetchReferences();
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
      setError(data.error);
    }
  };

//   const fetchUrlContent = () => {
//     if (!urlInput.trim()) return;
//     setIsProcessing(true);
//     setError(null);
//     try {
//       setTimeout(() => {
//         let hostname = "";
//         try {
//           hostname = new URL(urlInput).hostname;
//         } catch {
//           hostname = urlInput;
//         }
//         const newReference = {
//           id: Date.now().toString(),
//           type: "url",
//           title: `Content from ${hostname}`,
//           content: `This is extracted content from ${urlInput}.

// Note: This is a demonstration version. In a production environment, this would contain the actual scraped content from the webpage.

// The AI can now reference this web content when answering your questions about the topics covered on this page.`,
//           source: urlInput,
//         };
//         const updatedReferences = [...references, newReference];
//         setReferences(updatedReferences);
//         if (onReferencesChange) onReferencesChange(updatedReferences);
//         setUrlInput("");
//         setIsProcessing(false);
//       }, 2000);
//     } catch (error) {
//       setError("Invalid URL format. Please enter a valid URL.");
//       setIsProcessing(false);
//     }
//   };

  const removeReference = (id) => {
    setIsDeleting(true);
    fetch("/api/destroy-reference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (!res.ok) {
          setIsDeleting(false);
          setError("Something Went Wrong !");
        }
        return res.json();
      })
      .then((res) => {
        setIsDeleting(false);
        fetchReferences();
      });
  };

  const fetchReferences = () => {
    if (userUsername) {
      fetch("/api/fetch-references", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userUsername }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed To Fetch References");
          }
          return await res.json();
        })
        .then((res) => {
          if (res.success) {
            setReferences(res?.references);
          } else {
            setError(res.error);
          }
        })
        .catch((err) => {
          setError("Failed to Fetch references.");
        });
    }
  };

  useEffect(() => {
    if (userUsername) {
      fetchReferences();
    }
  }, [userUsername]);

  useEffect(() => {
      onReferencesChange(references);
  }, [references]);

  const getIcon = (type) => {
    if (type === "text") return "📝";
    if (type === "pdf") return "📄";
    if (type === "url") return "🔗";
    return "📄";
  };

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-xl p-6 border-0">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-2xl font-serif font-bold">Reference Library</h2>
        </div>
        <div className="hidden md:inline-block lg:inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary">
          Add content to reference
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl overflow-hidden">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <Label
            htmlFor="text-content"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Type className="w-4 h-4 text-primary" />
            Text Content
          </Label>
          <Textarea
            id="text-content"
            placeholder="Paste your text content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="h-32 resize-none bg-background/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button
            onClick={addTextReference}
            disabled={!textContent.trim()}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            Add Text Reference
          </Button>
        </div>

        <div className="space-y-3 mb-0">
          <Label
            htmlFor="pdf-upload"
            className="text-sm font-medium flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-accent" />
            PDF Upload
          </Label>
          <div className="border-2 border-dashed border-primary/30 rounded-xl text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="pdf-upload"
              onChange={handlePdfUpload}
              disabled={isProcessing}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer px-6 py-4 inline-block w-full"
            >
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <p className="font-medium mb-1">
                  Click to upload PDF
                </p>
                <p className="text-xs opacity-70">PDF files only*</p>
              </div>
            </label>
          </div>
        </div>

        {/* <div className="space-y-3">
          <Label
            htmlFor="url-input"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Link className="w-4 h-4 text-accent" />
            Website URL
          </Label>
          <div className="flex gap-3">
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-background/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Button
              onClick={fetchUrlContent}
              disabled={!urlInput.trim() || isProcessing}
              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Fetch
            </Button>
          </div>
        </div> */}

        {isProcessing && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-xl border border-primary/20">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-primary">
                Processing your content...
              </span>
            </div>
          </div>
        )}

        {isDeleting && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-destructive/5 rounded-xl border border-destructive/20">
              <div className="w-5 h-5 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-destructive">
                Deleting your content...
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 px-6 py-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/30">
          <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-lg">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            Current References ({references?.length})
          </h3>
          {references?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No content added yet
            </p>
          ) : (
            <div className="space-y-3 lg:h-[120px] md:max-h-[150px] max-h-[170px] overflow-y-scroll">
              {references?.map((ref, index) => {
                let textCount = 0;
                if (ref.type === "text") textCount++;
                return (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between px-4 py-3 bg-background/40 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getIcon(ref.type)}
                      </div>
                      <span className="text-sm font-medium truncate">
                        {ref.type === "text"
                          ? `Text Content ${textCount}`
                          : ref.fileName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReference(ref.id)}
                      className="cursor-pointer h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
