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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { RefObject, useState } from "react";
import { DialogSuccessAlert } from "@/components/SuccessAlert";
import { resetPasswordTokenAPI } from "@/app/_api/ResetPassAPIs";
import { toast } from "sonner";

interface ResetAlertProps {
  passRef: RefObject<HTMLInputElement | null>;
  ConfirmpassRef: RefObject<HTMLInputElement | null>;
  token: string | null;
}

export default function ResetAlert({
  passRef,
  ConfirmpassRef,
  token,
}: ResetAlertProps) {
  const [open, setOpen] = useState(false);
  const handleClick = async () => {
    const password = passRef.current?.value.trim();
    const confirmpass = ConfirmpassRef.current?.value.trim();

    if (!password || !confirmpass) {
      toast.error("Both fields are required.");
      return;
    }

    if (password !== confirmpass) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) {
      toast.error("Error while trying to reset password");
      return;
    }
    try {
      await resetPasswordTokenAPI(token, password);
      setOpen(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          toast.error(err.response.data?.message || "An error occurred.");
        } else if (err.request) {
          toast.error("Server did not respond. Please try again later.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

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
              This action cannot be undone. This will permanently reset your
              password and update it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogSuccessAlert open={open} setOpen={setOpen} />
    </>
  );
}
