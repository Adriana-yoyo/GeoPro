"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {/* ✅ 用 Link 包裹 Button，跳转到主页 */}
            <Button
              asChild
              variant="ghost"
              className="flex items-center space-x-2 text-foreground transition-all duration-200 hover:scale-105 hover:drop-shadow-sm hover:text-white"
              style={{
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #4057FC 0%, #9222FB 100%)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
              }}
            >
              <Link href="/">
                <span>←</span>
                <span>HOME</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #4057FC 0%, #9222FB 100%)" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 6l3 3-3 3-3-3z" strokeLinejoin="round" fill="none" />
                <g transform="translate(17, 7)">
                  <path d="M0 -2v4M-2 0h4" strokeLinecap="round" strokeWidth="1.2" />
                </g>
                <g transform="translate(7, 17)">
                  <path d="M0 -1.5v3M-1.5 0h3" strokeLinecap="round" strokeWidth="1" />
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">GEO Pro</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
