
import { cn } from "@/lib/utils";

interface PriceProps {
  amount: number;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Price({ amount, currency = "KES", className, size = "md" }: PriceProps) {
  const formattedAmount = new Intl.NumberFormat('en-KE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl font-bold",
  };

  return (
    <span className={cn("font-medium", sizeClasses[size], className)}>
      {currency} {formattedAmount}
    </span>
  );
}
