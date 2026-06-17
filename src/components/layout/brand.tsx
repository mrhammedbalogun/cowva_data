import Image from "next/image";

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/cowva-logo.png"
        alt="Cowva"
        width={2715}
        height={873}
        priority
        unoptimized
        className="h-7 w-auto"
      />
      {subtitle ? (
        <span className="border-l pl-2.5 text-xs font-medium text-muted-foreground">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
