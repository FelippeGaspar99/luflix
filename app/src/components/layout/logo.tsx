import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-40 w-[500px]">
        <Image
          src="/luflix-logo-v3.png"
          alt={siteConfig.name}
          fill
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  );
}
