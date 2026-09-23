import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Drag grip (mouse) plus up/down buttons (keyboard/touch-friendly
 * alternative to dragging — native HTML5 drag-and-drop doesn't work well
 * on touch anyway) for a single reorderable row.
 */
export function DragHandle({
  dragProps,
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  dragProps: React.HTMLAttributes<HTMLDivElement>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5 text-fg-muted">
      <div {...dragProps} className="cursor-grab touch-none px-1 active:cursor-grabbing">
        <GripVertical className="size-4" />
      </div>
      <div className="flex flex-col">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-4"
          aria-label="Move up"
          disabled={disableUp}
          onClick={onMoveUp}
        >
          <ChevronUp className="size-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-4"
          aria-label="Move down"
          disabled={disableDown}
          onClick={onMoveDown}
        >
          <ChevronDown className="size-3" />
        </Button>
      </div>
    </div>
  );
}
