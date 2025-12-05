"use client";

import { FormControl, FormDescription, FormItem, FormLabel } from "./form";
import { Switch } from "./switch";

interface PublishToggleProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function PublishToggle({
    checked,
    onCheckedChange,
    disabled = false,
}: Readonly<PublishToggleProps>) {
    return (
        <FormItem className="flex items-center gap-3">
            <FormControl>
                <Switch
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled}
                />
            </FormControl>
            <div className="space-y-0.5">
                <FormLabel className="text-sm font-medium cursor-pointer">
                    {checked ? "Published" : "Draft"}
                </FormLabel>
                <FormDescription className="text-xs">
                    {checked ? "Visible to everyone" : "Only visible to you"}
                </FormDescription>
            </div>
        </FormItem>
    );
}
