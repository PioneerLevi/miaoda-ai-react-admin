import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, User, MessageCircle } from "lucide-react";

const AVATAR_URL =
  "https://miaoda-site-img.cdn.bcebos.com/images/MiaoTu_ebf36d2c-0a01-4317-96a2-d3547278ebc6.jpg";

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "首页", icon: Home },
    { path: "/about", label: "关于", icon: User },
    { path: "/chat", label: "数字分身", icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8">
            <AvatarImage src={AVATAR_URL} alt="Leavis" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              LV
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground">Leavis</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
