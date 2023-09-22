"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
import { Trash } from 'lucide-react'
import { FC, useState } from 'react'
import * as  z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"


interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1)
})

export type SettingsFormValidator = z.infer<typeof formSchema>

const SettingsForm: FC<SettingsFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState();




  const form = useForm<SettingsFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SettingsFormValidator) => {
    console.log(data);

  }

  return <>
    <div className="flex items-center justify-between">
      <Heading
        title='Settings'
        description='おはようございます！'
      />
      <Button variant='destructive' className='w-10 h-10' size='sm' onClick={() => { }} >
        <Trash className='w-4 h-4' />
      </Button>
    </div>
    <Separator />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Store name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="ml-auto" type="submit">
          Save changes
        </Button>
      </form>
    </Form>
  </>
}

export default SettingsForm