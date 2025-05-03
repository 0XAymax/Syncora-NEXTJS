"use client"
import React, {forwardRef} from "react"
import { useState } from "react"
import { Card, CardContent,CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { format } from "date-fns"
import {
    AtSignIcon, BadgeCheck,
    CalendarIcon, CopyIcon,
    UserRoundIcon,
} from "lucide-react"
import {Slot} from "@radix-ui/react-slot";
import {User} from "@/types";
import {toast} from "sonner";
import AvatarUser from "@/components/Avatar-User";

interface UserProfileSheetProps {
    children: React.ReactNode;
    member :User;
    assignedBy :string;
}
const MemberProfileSheet = forwardRef<HTMLButtonElement, UserProfileSheetProps>(({ children,member,assignedBy }, ref) => {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex items-center gap-2" >
                <Slot ref={ref}>{children}</Slot>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-5">
                    <SheetTitle className="text-2xl">User Profile</SheetTitle>
                </SheetHeader>
                    <div className="space-y-6" >
                        <Card className="border shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6">
                                <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <AvatarUser
                                                name={member.name}
                                                lastName={member.lastName}
                                                avatarUrl={member.avatarUrl}
                                                height={24}
                                                width={24}
                                                borderSize={4}
                                                hasBorder={true}
                                            />
                                        </div>
                                    <div className="space-y-1 text-center">
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            {member.name} {member.lastName}
                                        </h2>
                                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                                            <CalendarIcon className="h-3.5 w-3.5" />
                                            {member.createdAt && (
                                                <span>Member since {format(member.createdAt, "MMMM d, yyyy")}</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                                            <AtSignIcon className="h-3.5 w-3.5" />
                                            <span>{member.email}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            <span>Assigned By : {assignedBy}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="px-6 pt-6 pb-0">
                                <h3 className="text-lg font-medium">Profile Information</h3>
                            </CardHeader>

                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                                            <UserRoundIcon className="h-4 w-4 text-muted-foreground" />
                                            First Name
                                        </Label>
                                            <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border shadow-sm">
                                                {member.name}
                                            </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                                            <UserRoundIcon className="h-4 w-4 text-muted-foreground" />
                                            Last Name
                                        </Label>
                                            <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border shadow-sm">
                                                {member.lastName}
                                            </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                        <AtSignIcon className="h-4 w-4 text-muted-foreground" />
                                        Email Address
                                    </Label>
                                    <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border shadow-sm flex items-center justify-between gap-2">
                                        <span className="truncate">{member.email}</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(member.email ?? "")
                                                toast.success("Email copied to clipboard")
                                            }}
                                            className="text-muted-foreground hover:text-primary transition cursor-pointer"
                                            type="button"
                                        >
                                            <CopyIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                            <Separator />
                        </Card>
                    </div>
            </SheetContent>
        </Sheet>
    )
});

MemberProfileSheet.displayName = "MemberProfileSheet"; // VERY IMPORTANT for React DevTools

export default MemberProfileSheet;
