"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  file: z
    .custom((val) => val instanceof FileList, "必需")
    .refine((files) => files.length > 0, "必需"),
});

export function UploadButton() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const { toast } = useToast();

  const user = useUser();
  const organization = useOrganization();
  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const createFile = useMutation(api.files.createFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values) {
    if (!orgId) return;
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
      });
    } catch (err) {
      toast({
        title: "文件上传失败",
        description: "查看浏览器的控制台或向开发者报告此问题",
      });
    } finally {
      form.reset();
      setIsFileDialogOpen(false);
    }
  }

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <Button>上传文件</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">文件上传</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>文件标题</FormLabel>
                    <FormControl>
                      <Input placeholder="文件名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>文件选择</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full flex items-center gap-2"
              >
                {form.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin"/>}
                上传
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
