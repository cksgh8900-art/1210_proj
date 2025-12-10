import Link from "next/link";
import { Map } from "lucide-react";

/**
 * @file Footer.tsx
 * @description 사이트 하단 Footer 컴포넌트
 *
 * 이 컴포넌트는 사이트 하단에 표시되는 Footer를 제공합니다.
 * - 저작권 정보
 * - 서비스 정보
 * - 반응형 디자인
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
              <Map className="h-5 w-5" />
              <span>My Trip</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              전국의 관광지 정보를 검색하고 여행을 계획하세요.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm">서비스</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                관광지 검색
              </Link>
              <Link
                href="/stats"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                통계 대시보드
              </Link>
              <Link
                href="/bookmarks"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                내 북마크
              </Link>
            </nav>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm">정보</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>한국관광공사 공공 API 기반</p>
              <p>데이터 제공: 한국관광공사</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} My Trip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

