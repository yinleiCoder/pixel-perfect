"use client";

import { useMutation, useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  file: z
    .custom((val) => val instanceof FileList, "必需")
    .refine((files) => files.length > 0, "必需"),
});

export default function Home() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const { toast } = useToast();

  const user = useUser();
  const organization = useOrganization();
  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
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
      toast({
        title: "文件上传成功",
        description: "上传的文件只能被当前组织查看",
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
    <main className="container mx-auto pt-6">
      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}
      <div className="flex justify-between items-center">
        <span className="text-2xl">组织空间</span>
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                  <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">上传</Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
