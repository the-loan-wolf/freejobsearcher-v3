"use client";

import type React from "react";
import Link from "next/link";

import { Search, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/app-components/ui/button";
import { Input } from "@/components/app-components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/app-components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/app-components/ui/avatar";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebaseLib";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Failed to sign out. Try again.");
    }
  };

  return (
    <header
      className={`sticky top-0 z-5 transition-all duration-300 ${
        isScrolled ? "glass-card" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/app"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300"
            >
              FreeJobSearcher
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors duration-300 hover:drop-shadow-sm"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors duration-300 hover:drop-shadow-sm"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-foreground/80 hover:text-primary transition-colors duration-300 hover:drop-shadow-sm"
              >
                About
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                className="pl-10 w-64 glass border-primary/20 focus:border-primary/40 focus:ring-primary/20"
                onChange={handleSearch}
              />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-primary/10 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
                  >
                    <Avatar className="h-6 w-6 ring-2 ring-primary/20">
                      <AvatarImage
                        src={user.photoURL || "/placeholder-user.jpg"}
                        alt="User"
                      />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.displayName}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 glass-strong border-primary/20"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/app/account/profile"
                      className="flex items-center"
                    >
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/app/account/settings"
                      className="flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/app/signin">
                  <UserCircle className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
