import { Converter } from "@/components/Converter";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-4xl font-bold pb-10">WebP 변환하기 🖼️</h1>
      <Converter />
    </div>
  );
}
