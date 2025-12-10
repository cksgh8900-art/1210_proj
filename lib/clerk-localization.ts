import { koKR } from "@clerk/localizations";

/**
 * Clerk 컴포넌트의 한국어 설정을 정의합니다.
 * 기본 koKR 로케일을 사용하며, 필요에 따라 특정 문구를 커스터마이징할 수 있습니다.
 * 
 * 공식 문서: https://clerk.com/docs/guides/customizing-clerk/localization
 */
export const clerkLocalization = {
    ...koKR,
    // 커스텀 문구 예시 (필요시 주석 해제하여 사용)
    // signIn: {
    //   ...koKR.signIn,
    //   start: {
    //     ...koKR.signIn?.start,
    //     title: "로그인",
    //     subtitle: "서비스를 이용하시려면 로그인해주세요",
    //   },
    // },
    // signUp: {
    //   ...koKR.signUp,
    //   start: {
    //     ...koKR.signUp?.start,
    //     title: "회원가입",
    //     subtitle: "새로운 계정을 만들어보세요",
    //   },
    // },
};
