'use client'

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  query: z.string().min(0).max(50),
});

function SearchBar({ query, setQuery }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values) {
    setQuery(values.query);
  }

  return (
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-1"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="文件名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SearchBar;
