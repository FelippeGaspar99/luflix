'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder, className }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const debounced = useDebouncedCallback((value: any) => {
    const newParams = new URLSearchParams(params?.toString());
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    const query = newParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, 400);

  return (
    <Input
      placeholder={placeholder}
      defaultValue={params?.get("search") ?? ""}
      onChange={(event) => debounced(event.target.value)}
      className={className}
    />
  );
}
