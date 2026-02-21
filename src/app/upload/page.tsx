import { Uploader } from "@/components/Uploader";

export default function UploadPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="pb-10">
        <h1 className="text-4xl font-bold">S3에 파일 업로드하기 📂</h1>
        <p className="text-center">제 s3에 올라가니 업로드 하지마세요...</p>
      </div>

      <Uploader />
    </div>
  );
}
