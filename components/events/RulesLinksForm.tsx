'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

interface RulesLinksFormProps {
  onNext: (data: FormData) => void;
  onBack: () => void;
  initialData: Partial<FormData>;
}

interface FormData {
  rules: string;
  upiId: string;
  externalLinks: { type: string; url: string; }[];
}

export function RulesLinksForm({ onNext, onBack, initialData }: RulesLinksFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      rules: initialData.rules || '',
      upiId: initialData.upiId || '',
      externalLinks: initialData.externalLinks || [{ type: '', url: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "externalLinks"
  });

  const onSubmit = (data: FormData) => {
    const validLinks = data.externalLinks.filter(link => link.type && link.url);
    onNext({
      ...data,
      externalLinks: validLinks.length > 0 ? JSON.stringify(validLinks) : null
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Rules & Guidelines</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event rules and guidelines..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="upiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPI ID for Payments</FormLabel>
              <FormControl>
                <Input placeholder="yourname@upi" {...field} />
              </FormControl>
              <FormDescription>
                Enter your UPI ID to receive payments for tickets
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>External Links</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: '', url: '' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <FormField
                control={form.control}
                name={`externalLinks.${index}.type`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Link type (e.g., Telegram)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`externalLinks.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="URL" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Form>
  );
}
