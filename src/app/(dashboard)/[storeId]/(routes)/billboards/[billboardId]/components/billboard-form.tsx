"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard } from '@prisma/client'
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
import billboardService from '@/services/billboard.service'
import AlertModal from './alert-modal'
import { log } from 'console'


const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
})

export type BillboardFormValidator = z.infer<typeof formSchema>


interface BillboardFormProps {
  initialData: Billboard | null
}



const BillboardForm: FC<BillboardFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState<boolean>(false);

  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<BillboardFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })

  const { mutate: toggleBillboard, isLoading: isBillboardLoading } = useMutation({
    mutationFn: async ({ body, storeId }: { body: BillboardFormValidator, storeId: string }) => {
      if (initialData) {
        return billboardService.updateBillboard(storeId, params.billboardId as string, body)
      } else {
        return billboardService.createBillboard(storeId, body)
      }
    },
    onSuccess: ({ data }) => {
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage)

      form.reset({
        label: data.label,
        imageUrl: data.imageUrl,
      })
    },
    onError: (err: any) => {
      toast.error(`${err}`)
    }
  })

  const { mutate: deleteBillboard, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (storeId: string) => {
      console.log(params.billboardId);
      return billboardService.deleteBillboard(storeId, params.billboardId as string)
    },
    onSuccess: () => {
      toast.success('Your billboard was deleted successfully')
      router.push(`/billboards`)

      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)
    }
  })


  const onSubmit = async (data: BillboardFormValidator) => {
    toggleBillboard({ body: data, storeId: params.storeId as string })
  }

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteBillboard(params.storeId as string)}
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
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input disabled={isBillboardLoading} placeholder="Billboard label name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className='grid grid-cols-3 gap-8'>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input disabled={isBillboardLoading} placeholder="Enter image url. Example: https://image.unsplash.com/tralyalya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isBillboardLoading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  </>
}

export default BillboardForm