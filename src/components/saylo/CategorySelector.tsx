"use client";

import { Category } from "@/utils/types";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CategorySelectorProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    allowCreate?: boolean;
    onNewCategory?: (name: string) => void;
}

export default function CategorySelector({
    categories,
    selectedCategory,
    onCategoryChange,
    allowCreate = false,
    onNewCategory,
}: Readonly<CategorySelectorProps>) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
                setIsCreating(false);
                setNewCategoryName("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateCategory = () => {
        if (newCategoryName.trim()) {
            onCategoryChange(newCategoryName.trim());
            onNewCategory?.(newCategoryName.trim());
            setShowDropdown(false);
            setIsCreating(false);
            setNewCategoryName("");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
            >
                <span className="text-xs">{selectedCategory || "Category"}</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            {showDropdown && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-card border border-border/50 rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Existing Categories */}
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                onCategoryChange(cat.name);
                                setShowDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-accent/50 transition-colors cursor-pointer ${selectedCategory === cat.name ? "bg-accent/50 text-foreground" : "text-muted-foreground"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}

                    {/* Create New Category */}
                    {allowCreate && (
                        <>
                            {isCreating ? (
                                <div className="p-2 border-t border-border/30">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="New category name"
                                        className="w-full px-2 py-1 text-sm bg-accent/30 border border-border/50 rounded outline-none focus:border-primary/50"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleCreateCategory();
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 border-t border-border/30 transition-colors cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    New category
                                </button>
                            )}
                        </>
                    )}

                    {/* Clear Category */}
                    {selectedCategory && (
                        <button
                            onClick={() => {
                                onCategoryChange(null);
                                setShowDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 border-t border-border/30 transition-colors cursor-pointer"
                        >
                            Clear category
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
