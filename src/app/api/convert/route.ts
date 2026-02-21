import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

ffmpeg.setFfmpegPath(ffmpegStatic!);

export const maxDuration = 60;

export async function POST(request: Request) {
  const id = randomUUID();
  const inputPath = join(tmpdir(), `${id}-input`);
  const outputPath = join(tmpdir(), `${id}-output.webp`);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 지원합니다." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(inputPath, buffer);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec("libwebp")
        .outputOptions(["-quality 85", "-vf scale=iw:ih"])
        .output(outputPath)
        .on("end", () => resolve())
        .on("error", (err: Error) => reject(err))
        .run();
    });

    const webpBuffer = await readFile(outputPath);
    const originalName = file.name.replace(/\.[^.]+$/, "");

    return new NextResponse(new Uint8Array(webpBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `attachment; filename="${originalName}.webp"`,
        "Content-Length": webpBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("ffmpeg conversion error:", err);
    return NextResponse.json(
      { error: "변환에 실패했습니다." },
      { status: 500 },
    );
  } finally {
    await Promise.allSettled([
      unlink(inputPath).catch(() => {}),
      unlink(outputPath).catch(() => {}),
    ]);
  }
}
