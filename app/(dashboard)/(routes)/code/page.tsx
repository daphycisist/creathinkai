'use client';
import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Code, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatCompletionRequestMessage } from 'openai';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { formSchema } from './constants';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import BotAvatar from '@/components/BotAvatar';
import ReactMarkdown from 'react-markdown'

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/code ', {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);
      form.reset();
    } catch (error) {
      //TODO: Open Premium sub Modal
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code using descriptive text"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full grid-cols-12 gap-2 p-4 px-3 border rounded-lg md:px-6 focus-within:shadow-sm"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="p-0 m-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="Send a prompt to generate a code snippet"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="w-full col-span-12 lg:col-span-2"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center w-full p-4 rounded-lg md:p-8 bg-muted">
              <Loader />
            </div>
          )}
          {!messages.length && !isLoading ? (
            <EmptyState label="No conversation started" />
          ) : (
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div
                  key={message.content}
                  className={cn(
                    'p-4 md:p-8 w-full flex items-start gap-x-8 rounded-lg',
                    message.role === 'user'
                      ? 'bg-white border border-black/10'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="w-full p-2 my-2 overflow-auto rounded-lg bg-black/10">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="p-1 rounded-lg bg-black/10"
                          {...props}
                        />
                      ),
                    }}
                    className="overflow-auto text-sm"
                  >
                    {message.content || ''}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePage;
