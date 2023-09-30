"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Size } from '@prisma/client'
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
import { useParams, useRouter } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'
import sizeService from '@/services/size.service'
import AlertModal from './alert-modal'
import { log } from 'console'


const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

export type SizeFormValidator = z.infer<typeof formSchema>


interface SizeFormProps {
  initialData: Size | null
}



const SizeForm: FC<SizeFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState<boolean>(false);

  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit Size' : 'Create Size'
  const description = initialData ? 'Edit a Size' : 'Add a new Size'
  const toastMessage = initialData ? 'Size updated.' : 'Size created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<SizeFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',

    }
  })

  const { mutate: toggleSize, isLoading: isSizeLoading } = useMutation({
    mutationFn: async ({ body, storeId }: { body: SizeFormValidator, storeId: string }) => {
      if (initialData) {
        return sizeService.updateSize(storeId, params.sizeId as string, body)
      } else {
        return sizeService.createSize(storeId, body)
      }
    },
    onSuccess: ({ data }) => {
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage)

      form.reset({
        name: data.name,
        value: data.value,
      })
    },
    onError: (err: any) => {
      toast.error(`${err}`)
    }
  })

  const { mutate: deleteSize, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (storeId: string) => {
      return sizeService.deleteSize(storeId, params.sizeId as string)
    },
    onSuccess: () => {
      toast.success('Your size was deleted successfully')
      router.push(`/sizes`)

      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)
    }
  })


  const onSubmit = async (data: SizeFormValidator) => {
    toggleSize({ body: data, storeId: params.storeId as string })
  }

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteSize(params.storeId as string)}
      loading={isDeleteLoading}

    />
    <div className="flex items-center justify-between">
      <Heading
        title={title}
        description={description}
      />
      {initialData ? <Button variant='destructive' className='w-10 h-10' size='sm' onClick={() => setOpen(true)} >
        <Trash className='w-4 h-4' />
      </Button> : null}
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
                  <Input disabled={isSizeLoading} placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className='grid grid-cols-3 gap-8'>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input disabled={isSizeLoading} placeholder="Enter image url. Example: https://image.unsplash.com/tralyalya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isSizeLoading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  </>
}

export default SizeForm