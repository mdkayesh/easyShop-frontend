"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PaginationProps = {
  totalCount: number;
};

const Paginations = ({ totalCount }: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pageCount, setPageCount] = useState(1);
  const [endIndx, setEndIndx] = useState(3);
  const [startIndx, setStartIndx] = useState(0);
  const pageNumber = Math.ceil(totalCount / 20);
  const pageBtns = 3;
  const pages = [];

  for (let i = 1; i <= pageNumber; i++) {
    pages.push(i);
  }

  const handlePageCount = (countBy: number) => {
    if (countBy === 1 && pageCount >= pageNumber) return;
    if (countBy === -1 && pageCount <= 1) return;
    setPageCount((prev) => prev + countBy);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageCount + countBy));
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const currentPage = Number(searchParams.get("page"));

    setPageCount(currentPage || 1);

    if (currentPage) {
      if (currentPage >= pageBtns) {
        setEndIndx(currentPage + 1);
      } else {
        setEndIndx(pageBtns);
      }

      if (currentPage > 2) {
        currentPage === pages.length
          ? setStartIndx(currentPage - pageBtns)
          : setStartIndx(currentPage - 2);
      } else {
        setStartIndx(0);
      }
    } else {
      setStartIndx(0);
      setEndIndx(pageBtns);
    }
  }, [searchParams, pages.length]);

  const selectPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    pageNumber > 1 && (
      <Pagination className="mt-10">
        <PaginationContent className="flex-wrap">
          <PaginationItem
            onClick={() => handlePageCount(-1)}
            className={`cursor-pointer ${
              1 >= pageCount ? "opacity-65 cursor-not-allowed" : ""
            }`}
          >
            <PaginationPrevious title="Prev" />
          </PaginationItem>
          {pageBtns <= pageCount && pageBtns < pages.length && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pages.slice(startIndx, endIndx).map((num) => (
            <PaginationItem key={num}>
              <PaginationLink
                isActive={num === pageCount}
                onClick={() => selectPage(num)}
                className="cursor-pointer select-none"
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pages.length > pageBtns &&
            pages.length - 1 !== pageCount &&
            pages.length - 1 > pageCount && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          <PaginationItem
            title="Next"
            onClick={() => handlePageCount(1)}
            className={`cursor-pointer ${
              pages.length === pageCount ? "opacity-65 cursor-not-allowed" : ""
            }`}
          >
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  );
};

export default Paginations;