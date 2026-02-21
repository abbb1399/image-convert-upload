"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Download, ImageIcon } from "lucide-react";

type ConvertState =
  | { status: "idle" }
  | { status: "converting"; fileName: string }
  | {
      status: "done";
      fileName: string;
      previewUrl: string;
      downloadUrl: string;
    }
  | { status: "error" };

export function Converter() {
  const [state, setState] = useState<ConvertState>({ status: "idle" });

  const convertFile = async (file: File) => {
    setState({ status: "converting", fileName: file.name });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        let message = "변환 실패";
        try {
          const json = JSON.parse(text);
          message = json.error || message;
        } catch {
          // HTML 에러 페이지 등 JSON이 아닌 경우
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const originalName = file.name.replace(/\.[^.]+$/, "");

      setState({
        status: "done",
        fileName: `${originalName}.webp`,
        previewUrl: blobUrl,
        downloadUrl: blobUrl,
      });

      toast.success("WebP 변환 완료!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "변환 실패";
      toast.error(message);
      setState({ status: "error" });
    }
  };

  const triggerDownload = () => {
    if (state.status !== "done") return;
    const a = document.createElement("a");
    a.href = state.downloadUrl;
    a.download = state.fileName;
    a.click();
  };

  const reset = () => {
    if (state.status === "done") {
      URL.revokeObjectURL(state.downloadUrl);
    }
    setState({ status: "idle" });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      convertFile(acceptedFiles[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isConverting = state.status === "converting";

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 20,
    accept: { "image/*": [] },
    disabled: isConverting,
  });

  return (
    <div className="w-full">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
          isConverting
            ? "border-border cursor-not-allowed opacity-60"
            : isDragActive
              ? "border-primary bg-primary/10 border-solid"
              : "border-border hover:border-primary cursor-pointer",
        )}
        {...(!isConverting ? getRootProps() : {})}
      >
        <CardContent className="flex flex-col items-center justify-center h-full w-full gap-y-3">
          <input {...getInputProps()} />

          {state.status === "idle" && (
            <>
              <ImageIcon className="size-8 text-muted-foreground" />
              <p className="text-center text-muted-foreground">
                이미지를 드래그하거나 클릭하여 선택하세요
              </p>
              <p className="text-xs text-muted-foreground">최대 20MB</p>
            </>
          )}

          {state.status === "converting" && (
            <>
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-muted-foreground">변환 중...</p>
              <p className="text-sm text-muted-foreground">{state.fileName}</p>
            </>
          )}

          {state.status === "done" && (
            <>
              <ImageIcon className="size-8 text-primary" />
              <p className="font-medium">{state.fileName}</p>
              <p className="text-sm text-muted-foreground">
                변환 완료 — 다른 파일을 드래그하거나 아래에서 다운로드하세요
              </p>
            </>
          )}

          {state.status === "error" && (
            <>
              <p className="text-destructive font-medium">
                변환에 실패했습니다
              </p>
              <p className="text-sm text-muted-foreground">
                파일을 다시 드래그하여 재시도하세요
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {state.status === "done" && (
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.previewUrl}
            alt="변환된 WebP 미리보기"
            className="max-h-64 rounded-lg border border-border object-contain"
          />
          <div className="flex gap-3">
            <Button onClick={triggerDownload}>
              <Download className="size-4" />
              WebP 다운로드
            </Button>
            <Button variant="outline" onClick={reset}>
              초기화
            </Button>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={reset}>
            초기화
          </Button>
        </div>
      )}
    </div>
  );
}
