"use client";

import type React from "react";
import Link from "next/link";

import { Search, LogOut, Settings, UserCircle } from 'lucide-react';
import { Button } from "@/components/app-components/ui/button";
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
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/app-components/ui/navigation-menu"
import { jobData } from "@/lib/jobCategories";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { slugify } from "@/lib/utils";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none">{title}</div>
          {/* <p className="text-muted-foreground line-clamp-2 text-sm leading-snug"> */}
          {/*   {children} */}
          {/* </p> */}
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export function Header({ onSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value.toLowerCase());
  };

  const closeSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    onSearch?.("");
  }

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
      className={`sticky top-0 z-5 transition-all duration-300 ${isScrolled ? "glass-card" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              href="/app"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300"
            >
              FreeJobSearcher
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 p-4 w-full lg:grid-cols-6 lg:gap-5 md:grid-cols-2 lg:px-20">
                      {jobData.map((categoryItem, index) => (
                        <li key={index}>
                          <strong>{categoryItem.category}</strong>
                          <ul className="mt-1 gap-5">
                            {categoryItem.jobs.map((job, jobIndex) => (
                              <ListItem key={jobIndex} title={job} href={`/app/category/${slugify(job)}`} />
                            ))}
                          </ul>

                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem >
                  <NavigationMenuTrigger className="bg-transparent">About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4">
            <InputGroup className="hidden sm:flex glass">
              <InputGroupInput
                onChange={handleSearch}
                placeholder="Search..."
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            {/* <button */}
            {/*   onClick={closeSearch} */}
            {/*   className="sm:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors" */}
            {/*   aria-label="Search" */}
            {/* > */}
            {/*   {isMobileSearchOpen ? ( */}
            {/*     <X className="h-5 w-5" /> */}
            {/*   ) : ( */}
            {/*     <Search className="h-5 w-5" /> */}
            {/*   )} */}
            {/* </button> */}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-0 sm:space-x-2 bg-primary/10 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
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

        {isMobileSearchOpen && (
          <div className="sm:hidden mt-4 mb-2">
            <InputGroup className="glass w-full">
              <InputGroupInput
                onChange={handleSearch}
                placeholder="Search..."
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
        )}
        <div className="flex w-full align-baseline md:mt-2">
          <NavigationMenu className="md:hidden">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent ">Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 w-full lg:grid-cols-6 lg:gap-5 md:grid-cols-2 lg:px-20">
                    {jobData.map((categoryItem, index) => (
                      <li key={index}>
                        <strong>{categoryItem.category}</strong>
                        <ul className="mt-1 gap-5">
                          {categoryItem.jobs.map((job, jobIndex) => (
                            <ListItem key={jobIndex} title={job} href={`/app/category/${slugify(job)}`} />
                          ))}
                        </ul>

                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ScrollArea
            className="flex-1 min-w-0 whitespace-nowrap"
          >
            <div className="flex w-max space-x-4">
              {jobData.map((categoryItem, index) => (
                <span key={index} className="mt-1 gap-5 flex">
                  {categoryItem.jobs.map((job, jobIndex) => (
                    <span
                      key={jobIndex}
                      className="text-sm text-muted-foreground"
                    >
                      <Link href={`/app/category/${slugify(job)}`} >
                        {job}
                      </Link>
                    </span>
                  ))}
                </span>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </header>
  );
}
