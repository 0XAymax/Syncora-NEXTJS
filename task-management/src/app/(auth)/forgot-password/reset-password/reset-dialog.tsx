import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from "axios";
import {useRouter} from "next/navigation";
import { Dispatch, RefObject, SetStateAction } from "react";

interface ResetAlertProps {
  passRef: RefObject<HTMLInputElement | null>;
  ConfirmpassRef: RefObject<HTMLInputElement | null>;
  setError: Dispatch<SetStateAction<string>>;
  token: string | null;
}

export default function ResetAlert(
    {passRef,ConfirmpassRef,setError,token} :ResetAlertProps
) {
    const router = useRouter();
    const handleClick = async () =>{
        const password = passRef.current?.value;
        const confirmpass = ConfirmpassRef.current?.value;
        if (password !== confirmpass) {
            setError("Password does not match");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:3001/api/auth/reset-password",
                { token, password }
            );
            alert(response.data.message);
            router.push("/")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(
                err.response ? err.response.data.message : "Invalid or expired token"
            );
        }
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Reset</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently reset your password
                            and update it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClick}>
                           Reset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}