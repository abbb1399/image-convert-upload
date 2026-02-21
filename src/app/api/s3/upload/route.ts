import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3Client";

const uploadRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const valdation = uploadRequestSchema.safeParse(body);

    if (!valdation.success) {
      return NextResponse.json(
        { error: "부적합한 요청 데이터입니다." },
        { status: 400 },
      );
    }

    const { fileName, contentType, size } = valdation.data;

    const uniqieKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqieKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // 6분
    });

    const response = {
      presignedUrl,
      key: uniqieKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: "내부 서버 에러" }, { status: 500 });
  }
}
