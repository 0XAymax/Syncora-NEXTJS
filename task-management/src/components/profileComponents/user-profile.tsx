"use client"
import React, {forwardRef, useEffect, useRef} from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    AtSignIcon,
    CalendarIcon,
    PencilIcon,
    SaveIcon, Upload, User,
    UserIcon,
    UserRoundIcon,
    XIcon,
} from "lucide-react"
import {Slot} from "@radix-ui/react-slot";
import {getUserDetailsAPI, updateUserDetailsAPI} from "@/app/_api/UsersAPIs";
import {updateUserRequest, UserDetails} from "@/types";
import {toast} from "sonner";
import DeleteProfileAlert from "@/components/profileComponents/DeleteProfileAlert";
import {useEdgeStore} from "@/lib/edgestore";

interface UserProfileSheetProps {
    children: React.ReactNode;
}
const UserProfileSheet = forwardRef<HTMLButtonElement, UserProfileSheetProps>(({ children }, ref) => {
    const [userDetailsState,setUserDetailsState] =useState<UserDetails>({
        name: "",
        lastName: "",
        email: "",
        avatarUrl: "",
        createdAt: new Date(),
        workspaces :[]
    })
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<UserDetails>(userDetailsState)
    const [open, setOpen] = useState(false)
    const [file,setFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const { edgestore } = useEdgeStore();
    const [uploading, setUploading] = useState(false);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setUploading(true);
        try {
            const res = await edgestore.publicFiles.upload({ file : selectedFile});
            setAvatarSrc(res.url);
            setFile(selectedFile);
            setFormData(prev => ({ ...prev, avatarUrl: res.url }));
            console.log("AVATAR URL",avatarSrc);
        } catch (err) {
            console.error("Avatar upload error:", err);
            toast.error("Failed to upload avatar.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    useEffect(()=>{
        const fetchUserDetails =async() =>{
            try{
                const data = await getUserDetailsAPI();
                setUserDetailsState(data);
            } catch (error) {
                console.error("Failed to fetch workspaces:", error);
            }
        }
        fetchUserDetails();
    },[])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSave = async() => {
        const pastData=userDetailsState;
        try{
            setUserDetailsState(formData);
            setIsEditing(false);
            const res = await updateUserDetailsAPI(formData as updateUserRequest);
            if(res && res.message == "User details updated successfully"){
                toast.success("User details updated successfully");
                return ;
            }else{
                setUserDetailsState(pastData);
                setIsEditing(true);
                return ;
            }
        }catch (error){
            setUserDetailsState(pastData);
            setIsEditing(true);
            console.error("Failed to update user:", error);
            toast.error("Failed to update user:");
        }
    }
    const toggleEdit = () => {
        if (isEditing) {
            setFormData(userDetailsState)
        } else {
            setFormData(userDetailsState)
        }
        setIsEditing(!isEditing)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex items-center gap-2" >
                <Slot ref={ref}>{children}</Slot>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
                <SheetHeader className="mb-5">
                    <SheetTitle className="text-2xl">User Profile</SheetTitle>
                </SheetHeader>
                {userDetailsState && (
                    <div className="space-y-6" >
                        <Card className="border shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6">
                                <div className="flex flex-col items-center gap-6">
                                    {isEditing ? (
                                        <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                            <Avatar className="w-24 h-24 border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                                                <AvatarImage src={avatarSrc || undefined} />
                                                <AvatarFallback className="bg-muted">
                                                    <User className="h-12 w-12 text-muted-foreground" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="h-6 w-6 text-white" />
                                            </div>
                                            <input type="file" ref={fileInputRef}  className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
                                        </div>
                                    ):(
                                        <div className="relative">
                                            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md">
                                                <AvatarImage
                                                    src={userDetailsState.avatarUrl || ""}
                                                    alt={`${userDetailsState.name} ${userDetailsState.lastName}`}
                                                />
                                                <AvatarFallback className="bg-slate-200 text-slate-800">
                                                    <UserIcon className="h-12 w-12" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )
                                    }
                                    <div className="space-y-1 text-center">
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            {userDetailsState.name} {userDetailsState.lastName}
                                        </h2>
                                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                                            <CalendarIcon className="h-3.5 w-3.5" />
                                            <span>Member since {format(userDetailsState.createdAt, "MMMM d, yyyy")}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                                            <AtSignIcon className="h-3.5 w-3.5" />
                                            <span>{userDetailsState.email}</span>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-center">
                                        <Button
                                            onClick={toggleEdit}
                                            variant={isEditing ? "outline" : "secondary"}
                                            size="sm"
                                            className="flex items-center gap-2 shadow-sm"
                                        >
                                            {isEditing ? (
                                                <>
                                                    <XIcon className="h-4 w-4" />
                                                    Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <PencilIcon className="h-4 w-4" />
                                                    Edit Profile
                                                </>
                                            )}
                                        </Button>
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
                                        {isEditing ? (
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="shadow-sm"
                                            />
                                        ) : (
                                            <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border shadow-sm">
                                                {userDetailsState.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                                            <UserRoundIcon className="h-4 w-4 text-muted-foreground" />
                                            Last Name
                                        </Label>
                                        {isEditing ? (
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="shadow-sm"
                                            />
                                        ) : (
                                            <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border shadow-sm">
                                                {userDetailsState.lastName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                        <AtSignIcon className="h-4 w-4 text-muted-foreground" />
                                        Email Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="shadow-sm"
                                        />
                                    ) : (
                                        <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border shadow-sm">
                                            {userDetailsState.email}
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <Separator />

                            <CardFooter className="p-6 flex">
                                {isEditing ? (
                                    <Button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 shadow-md transition-all hover:shadow-lg"
                                    >
                                        <SaveIcon className="h-4 w-4" />
                                        Save Changes
                                    </Button>
                                ):(
                                   <DeleteProfileAlert />
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
});

UserProfileSheet.displayName = "UserProfileSheet"; // VERY IMPORTANT for React DevTools

export default UserProfileSheet;
