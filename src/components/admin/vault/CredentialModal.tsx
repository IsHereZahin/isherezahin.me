"use client";

import { useEffect, useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormActions, FormModal, Input, Textarea } from "@/components/ui";
import { vault } from "@/lib/api";
import type { VaultCredential } from "@/lib/vault/types";

interface CredentialModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    credential?: VaultCredential | null;
    folderId?: string | null;
}

export default function CredentialModal({ open, onOpenChange, credential, folderId }: Readonly<CredentialModalProps>) {
    const queryClient = useQueryClient();
    const isEdit = !!credential;

    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notes, setNotes] = useState("");
    const [urlHint, setUrlHint] = useState("");
    const [tags, setTags] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (credential) {
            setTitle(credential.title);
            setUsername(credential.username);
            setPassword(credential.password);
            setNotes(credential.notes);
            setUrlHint(credential.urlHint);
            setTags(credential.tags.join(", "));
        } else {
            setTitle("");
            setUsername("");
            setPassword("");
            setNotes("");
            setUrlHint("");
            setTags("");
        }
        setShowPassword(false);
    }, [credential, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                title,
                username,
                password,
                notes,
                urlHint,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                folderId: credential?.folderId ?? folderId ?? null,
            };
            if (isEdit) {
                await vault.credentials.update(credential._id, payload);
                toast.success("Credential updated");
            } else {
                await vault.credentials.create(payload);
                toast.success("Credential saved");
            }
            queryClient.invalidateQueries({ queryKey: ["vault-credentials"] });
            queryClient.invalidateQueries({ queryKey: ["vault-all"] });
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save credential");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <FormModal
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Credential" : "New Credential"}
            description="Stored fully encrypted at rest with your vault key."
            icon={KeyRound}
            maxWidth="sm:max-w-[600px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input className="mt-1" placeholder="e.g. Database server" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Username</label>
                    <Input className="mt-1" placeholder="Username or email" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Password / Secret</label>
                    <div className="relative mt-1">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Secret value"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10"
                        />
                        <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--s-muted)] hover:text-[var(--s-text)]">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">URL hint</label>
                    <Input className="mt-1" placeholder="Where this is used (optional)" value={urlHint} onChange={(e) => setUrlHint(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea className="mt-1" placeholder="Additional encrypted notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Input className="mt-1" placeholder="Comma-separated tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <FormActions
                    onCancel={() => onOpenChange(false)}
                    submitText={submitting ? "Saving..." : "Save Credential"}
                    isSubmitting={submitting}
                />
            </form>
        </FormModal>
    );
}
