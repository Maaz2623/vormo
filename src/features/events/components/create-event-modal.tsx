"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCreateEventModalStore } from "../store/use-create-event-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Required.",
    })
    .max(50, {
      message: "Max 50 characters allowed.",
    }),
  price: z.number().min(1),
  venueLocation: z.string().min(1, {
    message: "Required.",
  }),
  venueTag: z.string().min(1, {
    message: "Required.",
  }),
  dateTime: z.string().min(1, {
    message: "Required",
  }),
});

const CreateEventModal = () => {
  const [mapOpen, setMapOpen] = useState(false);

  const [completed, setCompleted] = useState(0);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0, // You can set a minimum price, for example, 1
      venueLocation: "",
      venueTag: "",
      dateTime: "", // Provide a default date-time as an empty string or a valid default value
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const [open, setOpen] = useCreateEventModalStore();

  return (
    <>
      <Button variant={`outline`} size={`icon`} onClick={() => setOpen(true)}>
        <PlusIcon />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-[550px] h-[500px] max-w-[1000px]">
          <AlertDialogHeader className="w-full flex justify-center items-center">
            <AlertDialogTitle className="text-2xl font-semibold">
              Create Event
            </AlertDialogTitle>
            <AlertDialogDescription className="">
              Fill in the details of your latest event
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="w-full h-8 my-4 justify-center items-center flex flex-col">
            <div className="flex justify-center items-center relative w-2/3">
              <div
                className={cn(
                  "border font-semibold text-sm absolute transition-all duration-300 bg-white -left-2 rounded-lg z-20 px-2 py-1",
                  completed >= 0 && "bg-green-600 text-white"
                )}
              >
                1
              </div>
              <div
                className={cn(
                  "border font-semibold text-sm absolute transition-all duration-300 bg-white -left-50 rounded-lg px-2 z-20 py-1",
                  completed >= 50 && "bg-green-600 text-white"
                )}
              >
                2
              </div>
              <div
                className={cn(
                  "border font-semibold transition-all duration-300 text-sm absolute bg-white -right-2 rounded-lg px-2 py-1 z-20",
                  completed === 100 && "bg-green-600 text-white"
                )}
              >
                3
              </div>
              <Progress value={completed} className="w-full z-10" />
            </div>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 border"
              >
                <div className="flex gap-x-4 w-full border items-center justify-between">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input className="" placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Ticket Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. ₹100, ₹0"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div></div>
              </form>
            </Form>
          </div>

          <div className="w-full flex justify-center items-center -mt-4">
            {completed !== 100 && (
              <div className="flex  gap-x-3">
                {completed !== 0 && (
                  <Button
                    variant={`outline`}
                    className="text-sm font-semibold w-[100px] transition-all duration-300 transform"
                    onClick={() => setCompleted(completed - 50)}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  className="text-sm font-semibold w-[100px]"
                  onClick={() => setCompleted(completed + 50)}
                >
                  Next
                </Button>
              </div>
            )}
            {completed === 100 && (
              <div className="flex border gap-x-3">
                <Button
                  variant={`outline`}
                  className="text-sm font-semibold w-[100px]"
                  onClick={() => setCompleted(completed - 50)}
                >
                  Previous
                </Button>
                <Button className="text-sm font-semibold w-[100px]">
                  Finish
                </Button>
              </div>
            )}
          </div>


        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={mapOpen} onOpenChange={setMapOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateEventModal;
