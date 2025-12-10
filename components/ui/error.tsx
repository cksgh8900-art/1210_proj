"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    reset?: () => void; // For Next.js error boundaries
}

export default function ErrorComponent({
    title = "오류가 발생했습니다",
    message = "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    onRetry,
    reset
}: ErrorProps) {
    const handleRetry = () => {
        if (onRetry) onRetry();
        if (reset) reset();
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
            {(onRetry || reset) && (
                <Button onClick={handleRetry} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    다시 시도
                </Button>
            )}
        </div>
    );
}
