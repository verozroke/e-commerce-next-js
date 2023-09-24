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
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import storeService from '@/services/store.service'
import { useParams, useRouter } from 'next/navigation'
import { log } from 'console';
import AlertModal from './alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'


interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1)
})

export type SettingsFormValidator = z.infer<typeof formSchema>

const SettingsForm: FC<SettingsFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState<boolean>(false);

  const params = useParams()
  const router = useRouter()

  const origin = useOrigin()

  const form = useForm<SettingsFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const { mutate: updateStoreName, isLoading: isUpdateLoading } = useMutation({
    mutationFn: ({ body, storeId }: { body: SettingsFormValidator, storeId: string }) => storeService.updateStore(body, storeId),
    onSuccess: ({ data }) => {
      toast.success('Your store was updated successfully')

      form.reset({
        name: data.name
      })
    },
    onError: (err: any) => {
      toast.error(`${err}`)
    }
  })

  const { mutate: deleteStore, isLoading: isDeleteLoading } = useMutation({
    mutationFn: (storeId: string) => storeService.deleteStore(storeId),
    onSuccess: () => {
      toast.success('Your store was deleted successfully')
      setOpen(false)
      router.refresh()
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)

    }
  })


  const onSubmit = async (data: SettingsFormValidator) => {
    updateStoreName({ body: data, storeId: params.storeId as string })
  }

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteStore(params.storeId as string)}
      loading={isDeleteLoading}

    />
    <div className="flex items-center justify-between">
      <Heading
        title='Settings'
        description='おはようございます！'
      />
      <Button variant='destructive' className='w-10 h-10' size='sm' onClick={() => setOpen(true)} >
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
                  <Input disabled={isUpdateLoading} placeholder="Store name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isUpdateLoading} className="ml-auto" type="submit">
          Save changes
        </Button>
      </form>
    </Form>
    <Separator />
    <ApiAlert variant='public' title='NEXT_PUBLIC_API_URL' description={`${origin}/api/${params.storeId}`} />
  </>
}

export default SettingsForm