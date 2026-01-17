import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "zh"];

const resolveLocale = (request: NextRequest) => {
  const savedLocale = request.cookies.get("locale")?.value;
  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().startsWith("zh")) {
    return "zh";
  }
  return "en";
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const currentLocale = segments[1];
  if (locales.includes(currentLocale)) {
    return NextResponse.next();
  }

  const locale = resolveLocale(request);
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
