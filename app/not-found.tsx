import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="bg-muted p-6 rounded-full mb-6">
                <Map className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <h2 className="text-xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
                입력하신 주소가 정확한지 다시 한번 확인해 주세요.
            </p>
            <Link href="/">
                <Button size="lg">홈으로 돌아가기</Button>
            </Link>
        </div>
    );
}
