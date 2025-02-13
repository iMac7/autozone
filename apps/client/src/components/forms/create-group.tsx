import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { group } from "@lens-protocol/metadata";
import { createGroup } from "@lens-protocol/client/actions";
import { handleWith } from "@lens-protocol/client/viem";
import { uri } from '@lens-protocol/client';

import { storageClient } from '@/utils/storageclient';
import { getSession } from '@/utils/auth/auth';
import { walletClient } from '@/utils/viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
});

interface CreateGroupFormProps {
  onSuccess?: () => void;
}

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 1. Create metadata
      const metadata = group({
        name: values.name,
        description: values.description,
        icon: values.icon,
      });

      // 2. Upload metadata
      const { uri: metadataUri } = await storageClient.uploadAsJson(metadata);

      // 3. Deploy group contract
      const sessionClient = await getSession()
      const result = await createGroup(sessionClient!, {
        metadataUri: uri(metadataUri),
      })
        .andThen(handleWith(walletClient))
        .andThen(sessionClient!.waitForTransaction);

      if (result.isOk()) {
        onSuccess?.(result.value);
        form.reset();
      } else {
        form.setError("root", {
          message: result.error.message || 'Failed to create group'
        });
      }
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : 'An error occurred'
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 relative">
        <Button className="absolute top-0 right-0" variant="outline"
        onClick={onSuccess}>
            Back
        </Button>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon URI</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="lens://..."
                  disabled={form.formState.isSubmitting} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? 'Creating Group...' : 'Create Group'}
        </Button>
      </form>
    </Form>
  );
}
