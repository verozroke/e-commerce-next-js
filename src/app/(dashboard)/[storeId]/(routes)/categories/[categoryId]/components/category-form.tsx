"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard, Category } from '@prisma/client'
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
import AlertModal from './alert-modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import categoryService from '@/services/category.service'


const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
})

export type CategoryFormValidator = z.infer<typeof formSchema>


interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}



const CategoryForm: FC<CategoryFormProps> = ({ initialData, billboards }) => {

  const [open, setOpen] = useState<boolean>(false);

  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit category' : 'Create category'
  const description = initialData ? 'Edit a category' : 'Add a new category'
  const toastMessage = initialData ? 'Category updated.' : 'Category created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<CategoryFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  })

  const { mutate: toggleCategory, isLoading: isCategoryLoading } = useMutation({
    mutationFn: async ({ body, storeId }: { body: CategoryFormValidator, storeId: string }) => {
      if (initialData) {
        return categoryService.updateCategory(storeId, params.categoryId as string, body)
      } else {
        return categoryService.createCategory(storeId, body)
      }
    },
    onSuccess: ({ data }) => {
      router.push(`/${params.storeId}/categories`)
      toast.success(toastMessage)

      form.reset({
        name: data.name,
        billboardId: data.billboardId,
      })
    },
    onError: (err: any) => {
      toast.error(`${err}`)
    }
  })

  const { mutate: deleteCategory, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (storeId: string) => {
      console.log(params.billboardId);
      return categoryService.deleteCategory(storeId, params.categoryId as string)
    },
    onSuccess: () => {
      toast.success('Your category was deleted successfully')
      router.push(`/categories`)

      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)
    }
  })


  const onSubmit = async (data: CategoryFormValidator) => {
    toggleCategory({ body: data, storeId: params.storeId as string })
  }

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteCategory(params.storeId as string)}
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
                  <Input disabled={isCategoryLoading} placeholder="Category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <Select disabled={isCategoryLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a billboard"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem
                        key={billboard.id}
                        value={billboard.id}
                      >
                        {billboard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <Button disabled={isCategoryLoading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  </>
}

export default CategoryForm