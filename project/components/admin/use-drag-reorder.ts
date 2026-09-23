"use client";

import { useState } from "react";

/**
 * Native HTML5 drag-and-drop reordering — deliberately no dnd-kit/
 * react-beautiful-dnd dependency for what's a handful of short admin lists
 * (projects, STL models, experience entries). Swap-on-dragenter is the
 * standard hand-rolled pattern: as the dragged item passes over another,
 * they swap positions immediately, so the drop itself just commits
 * whatever order is already showing.
 *
 * `items` is local, optimistic UI state seeded from the prop passed in —
 * it does NOT resync if the parent re-renders with a different `items`
 * array after the initial mount (e.g. someone adds a new row elsewhere).
 * Each consumer already re-mounts on navigation/revalidation in this app's
 * usage, so that's an acceptable tradeoff for the simplicity it buys.
 */
export function useDragReorder<T>({
  items: initialItems,
  getId,
  onReorder,
}: {
  items: T[];
  getId: (item: T) => string;
  onReorder: (orderedIds: string[]) => void;
}) {
  const [items, setItems] = useState(initialItems);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function moveOver(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    setItems((prev) => {
      const sourceIndex = prev.findIndex((i) => getId(i) === draggingId);
      const targetIndex = prev.findIndex((i) => getId(i) === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  function moveByOffset(id: string, offset: 1 | -1) {
    const index = items.findIndex((i) => getId(i) === id);
    const targetIndex = index + offset;
    if (index === -1 || targetIndex < 0 || targetIndex >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    onReorder(next.map(getId));
  }

  function dragHandleProps(id: string) {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
      },
      onDragEnter: () => moveOver(id),
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        if (draggingId) onReorder(items.map(getId));
        setDraggingId(null);
      },
      onDragEnd: () => setDraggingId(null),
    };
  }

  return { items, draggingId, dragHandleProps, moveByOffset };
}
