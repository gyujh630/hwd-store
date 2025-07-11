import React from "react";

export default function KakaoConsultButton() {
  return (
    <a
      href="https://pf.kakao.com/_fpxnFn"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed sm:bottom-10 sm:right-10 bottom-6 right-6 z-50"
      aria-label="카카오톡 채널 상담"
    >
      <span
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-md"
        style={{
          background: "linear-gradient(180deg, #ffe300 0%, #e6c200 100%)"
        }}
      >
        <svg width="36" height="36" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.5 2.62891C6.16282 2.62891 2.64282 5.36319 2.64282 8.72605C2.64282 10.8239 4.00211 12.6546 6.07639 13.7703L5.20425 16.9682C5.1878 17.0318 5.19118 17.0989 5.21396 17.1605C5.23673 17.2222 5.27781 17.2754 5.33167 17.313C5.38554 17.3506 5.44962 17.3709 5.51532 17.371C5.58102 17.3712 5.6452 17.3513 5.69925 17.3139L9.51782 14.776C9.83997 14.776 10.17 14.8311 10.5 14.8311C14.8371 14.8311 18.3571 12.0968 18.3571 8.72605C18.3571 5.35534 14.8371 2.62891 10.5 2.62891Z" fill="#181600"/>
        </svg>
      </span>
    </a>
  );
} 