"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Color } from '@prisma/client'
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
import AlertModal from './alert-modal'
import colorService from '@/services/color.service'


const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be a valid hex code'
  }),
})

export type ColorFormValidator = z.infer<typeof formSchema>


interface ColorFormProps {
  initialData: Color | null
}



const ColorForm: FC<ColorFormProps> = ({ initialData }) => {

  const [open, setOpen] = useState<boolean>(false);

  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit Color' : 'Create Color'
  const description = initialData ? 'Edit a Color' : 'Add a new Color'
  const toastMessage = initialData ? 'Color updated.' : 'Color created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<ColorFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',

    }
  })

  const { mutate: toggleColor, isLoading: isColorLoading } = useMutation({
    mutationFn: async ({ body, storeId }: { body: ColorFormValidator, storeId: string }) => {
      if (initialData) {
        return colorService.updateColor(storeId, params.colorId as string, body)
      } else {
        return colorService.createColor(storeId, body)
      }
    },
    onSuccess: ({ data }) => {
      router.push(`/${params.storeId}/colors`)
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

  const { mutate: deleteColor, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (storeId: string) => {
      return colorService.deleteColor(storeId, params.colorId as string)
    },
    onSuccess: () => {
      toast.success('Your color was deleted successfully')
      router.push(`/colors`)

      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)
    }
  })


  const onSubmit = async (data: ColorFormValidator) => {
    toggleColor({ body: data, storeId: params.storeId as string })
  }

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteColor(params.storeId as string)}
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
                  <Input disabled={isColorLoading} placeholder="Name" {...field} />
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
                  <Input disabled={isColorLoading} placeholder="Enter value" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isColorLoading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  </>
}

export default ColorForm