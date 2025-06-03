import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface MaterialChipProps {
  name: string
  color: string
  onRemove: () => void
}

export function MaterialChip({ name, color, onRemove }: MaterialChipProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border",
      color
    )}>
      {name}
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-white/20 rounded-full p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
