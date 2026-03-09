"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SortableModule({ id, children }: { id: string; children: (dragHandleProps: any) => React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, position: "relative" as const, zIndex: isDragging ? 50 : undefined };
    return <div ref={setNodeRef} style={style}>{children({ ...attributes, ...listeners })}</div>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SortableLesson({ id, children }: { id: string; children: (dragHandleProps: any) => React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, position: "relative" as const, zIndex: isDragging ? 50 : undefined };
    return <div ref={setNodeRef} style={style}>{children({ ...attributes, ...listeners })}</div>;
}
