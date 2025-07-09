/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bubbleUser: "#a2beff",     // 사용자 말풍선
        bubbleBot: "#fee6a5",      // 챗봇 말풍선
        bubbleSystem: "#fcfffd",   // 시스템 메시지
        bubbleAlt: "#daffef",      // 보조용 민트
        bubbleMuted: "#5d737e",    // 어두운 회색-청록 
        chatHeader: {
          DEFAULT: "#a5dcb8",
          600: "#76be8f"},
      },
    },
    keyframes: {
      fadeIn: {
        '0%': {opacity: 0, transform: 'translateY(5px)'},
        '100%': {opacity:1, transform: 'translateY(0)'},
      }
    }
  },
  plugins: [],
}
