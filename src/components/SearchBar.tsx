"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";
import { IoSearch } from "react-icons/io5";
import { cn } from "@/lib/utils";

const shops = [
  { title: "gadgets", icon: "/icons/gadgets.png" },
  { title: "grocery", icon: "/icons/grocery.png" },
  { title: "bakery", icon: "/icons/bakery.png" },
  { title: "clothing", icon: "/icons/clothing.png" },
  { title: "makeup", icon: "/icons/makeup.png" },
  { title: "bags", icon: "/icons/bag.png" },
  { title: "furniture", icon: "/icons/furniture.png" },
  { title: "books", icon: "/icons/books.png" },
  { title: "medicine", icon: "/icons/medicine.png" },
];

type SearchBarProps = {
  setIsSearchOpen?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  useSelect?: boolean;
};

const SearchBar = ({
  setIsSearchOpen,
  className,
  useSelect = true,
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectedShop, setSelectedShop] = useState<undefined | string>(
    undefined
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchValue) return;

    if (selectedShop === "Select Shop" || !selectedShop) {
      return;
    } else {
      router.push(`/shops/${selectedShop}?q=${searchValue}`);
      if (!setIsSearchOpen) return;
      setIsSearchOpen(false);
    }
  };

  const handleSelectShop = (shop?: string) => {
    const activeShop = shops.find((s) => pathname?.includes(s.title));
    if (activeShop && !shop) {
      setSelectedShop(activeShop.title);
    } else if (shop) {
      router.push(`/shops/${shop}`);
      setSelectedShop(shop);
    } else {
      setSelectedShop(undefined);
    }
  };

  useEffect(() => {
    handleSelectShop();

    return () => {};
  }, [pathname]);

  return (
    <form
      className={cn(
        "searchBar flex items-center border-input border rounded-lg focus-within:border-primary overflow-hidden bg-secondary",
        className
      )}
      onSubmit={handleSubmit}
    >
      {useSelect && (
        <Select onValueChange={handleSelectShop} value={selectedShop}>
          <SelectTrigger className="min-w-[70px] max-w-fit border-none rounded-none bg-accent">
            <SelectValue placeholder="Select Shop" className="capitalize" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-muted-foreground">Shops</SelectLabel>
              {shops.map((shop, index) => (
                <SelectItem
                  value={shop.title}
                  key={index}
                  className="px-4 [&>.indicator]:hidden capitalize"
                >
                  <div className="flex items-center">
                    <Image
                      src={shop.icon}
                      width={40}
                      height={40}
                      alt={shop.title}
                    />

                    <span>{shop.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <Input
        placeholder="Search products"
        className="border-none rounded-none"
        type="text"
        onChange={(e) => setSearchValue(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />

      <Button className="text-xl" type="submit">
        <IoSearch />
      </Button>
    </form>
  );
};

export default SearchBar;