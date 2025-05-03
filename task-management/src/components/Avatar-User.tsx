"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";

interface AvatarUserType {
    name?: string;
    lastName?: string;
    avatarUrl?: string;
    height?:number;
    width?:number;
    borderSize?:number;
    hasBorder?: boolean;
}
export default function AvatarUser({name, lastName,avatarUrl, height, width, borderSize,hasBorder}: AvatarUserType) {
    return (
        <Avatar  className={`h-${height} w-${width} border-${borderSize} ${
            hasBorder ? 'border-white dark:border-slate-800' : ''
        } shadow-md`}>
            <AvatarImage
                src={avatarUrl || undefined}
                alt={`${name} ${lastName}`}
            />
            <AvatarFallback className="bg-slate-200 text-slate-800">
                {name &&
                    name.charAt(0).toUpperCase() +
                    (lastName &&
                        lastName.charAt(0).toUpperCase())}
            </AvatarFallback>
        </Avatar>
    );
}
