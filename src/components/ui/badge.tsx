import * as React from "react"
import { cn } from "@/lib/utils"
import { badgeVariants, BadgeVariantsProps } from "./badgeVariants"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantsProps {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
