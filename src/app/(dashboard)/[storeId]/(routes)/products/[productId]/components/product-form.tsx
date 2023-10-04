"use client"

import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Color, Image, Product, Size } from '@prisma/client'
import { Trash } from 'lucide-react'
import { FC, useState } from 'react'
import * as  z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import productService from '@/services/product.service'


const formSchema = z.object({
  name: z.string().min(1),
  image: z.object({ url: z.string() }),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()

})

export type ProductFormValidator = z.infer<typeof formSchema>


interface ProductFormProps {
  initialData: Product & {
    image: Image | null
  } | null
  categories: Category[]
  sizes: Size[]
  colors: Color[]
}



const ProductForm: FC<ProductFormProps> = ({ initialData, categories, colors, sizes }) => {

  const [open, setOpen] = useState<boolean>(false);

  const params = useParams()
  const router = useRouter()

  const title = initialData ? 'Edit Product' : 'Create Product'
  const description = initialData ? 'Edit a Product' : 'Add a new Product'
  const toastMessage = initialData ? 'Product updated.' : 'Product created.'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<ProductFormValidator>({
    resolver: zodResolver(formSchema),
    //@ts-ignore
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price))
    } : {
      name: '',
      image: { url: '' },
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false,
    }
  })

  const { mutate: toggleProduct, isLoading: isProductLoading } = useMutation({
    mutationFn: async ({ body, storeId }: { body: ProductFormValidator, storeId: string }) => {
      if (initialData) {
        return productService.updateProduct(storeId, params.productId as string, body)
      } else {
        return productService.createProduct(storeId, body)
      }
    },
    onSuccess: ({ data }) => {
      router.push(`/${params.storeId}/products`)
      toast.success(toastMessage)

      // form.reset({
      //   label: data.label,
      //   imageUrl: data.imageUrl,
      // })
    },
    onError: (err: any) => {
      toast.error(`${err}`)
    }
  })

  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (storeId: string) => {
      return productService.deleteProduct(storeId, params.productId as string)
    },
    onSuccess: () => {
      toast.success('Your product was deleted successfully')
      router.push(`/products`)

      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)
    }
  })


  const onSubmit = async (data: ProductFormValidator) => {
    toggleProduct({ body: data, storeId: params.storeId as string })
  }

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteProduct(params.storeId as string)}
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
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input disabled={isProductLoading} placeholder="Billboard label name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type='number' disabled={isProductLoading} placeholder="9.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a category"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a size"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem
                        key={size.id}
                        value={size.id}
                      >
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a color"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem
                        key={color.id}
                        value={color.id}
                      >
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-3 gap-8'>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input disabled={isProductLoading} placeholder="Enter image url. Example: https://image.unsplash.com/tralyalya" value={field.value.url} onChange={(e) => field.onChange({ url: e.target.value })} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* @ts-expect-error onCheckedChange hook form type error */}
        <FormField
          control={form.control}
          name='isFeatured'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  className='mt-1'

                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Featured
                </FormLabel>
                <FormDescription>
                  This product will appear on the home page
                </FormDescription>
              </div>
            </FormItem>
          )}
        >

        </FormField>
        {/* @ts-expect-error onCheckedChange hook form type error */}
        <FormField
          control={form.control}
          name='isArchived'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  className='mt-1'
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Archived
                </FormLabel>
                <FormDescription>
                  This product will not appear anywhere in the store
                </FormDescription>
              </div>
            </FormItem>
          )}
        >

        </FormField>
        <Button disabled={isProductLoading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  </>
}

export default ProductForm