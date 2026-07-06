// 카카오로그인
const KAKAO_REST_API="007438fd58de051608236584233d68c5"
const KAKAO_REDIRECT_URL="http://localhost:3000/home/login/kakao"

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;