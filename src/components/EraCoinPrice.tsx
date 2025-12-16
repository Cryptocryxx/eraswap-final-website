import eraCoinIcon from "figma:asset/724febc18db287bf1715ab2a9524f2f860196cfb.png";

interface EraCoinPriceProps {
  amount: string | number;
  size?: "sm" | "md" | "lg";
}

export function EraCoinPrice({ amount, size = "md" }: EraCoinPriceProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`flex items-center gap-1.5 text-primary ${sizeClasses[size]}`}>
      <img 
        src={eraCoinIcon} 
        alt="EraCoin" 
        className={`${iconSizes[size]} inline-block`}
      />
      <span>{amount}</span>
    </div>
  );
}
