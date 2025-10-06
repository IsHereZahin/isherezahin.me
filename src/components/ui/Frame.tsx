"use client"

import Image from "next/image";
import type React from "react";

import { useState } from "react";
import { ProjectType } from "../Project";
export interface FrameProps {
    project: Readonly<ProjectType>;
}

export default function Frame({ project }: Readonly<FrameProps>) {
    const [transform, setTransform] = useState("")

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        // Reduce rotation
        const rotateX = ((y - centerY) / centerY) * 5
        const rotateY = ((x - centerX) / centerX) * 5

        // Reduce scale
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
        const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2))
        const scale = 1 + (1 - distance / maxDistance) * 0.02 // Max 2% scale

        setTransform(`perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`)
    }

    const handleMouseLeave = () => {
        setTransform("")
    }

    return (
        <div onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: transform,
                transition: transform ? "transform 0.3s ease-out" : "transform 0.5s ease-out",
            }} className="flex items-center rounded-xl justify-center bg-frame-background py-6 px-8 shadow-feature-card">
            <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-sm bg-muted">
                <Image
                    height={300}
                    width={200}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}
