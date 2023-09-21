"use client"
import Modal from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { log } from 'console';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Button } from '../button';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import storeService from '@/services/store.service';

const formSchema = z.object({
  name: z.string().min(1),
})

export type createStoreFormValidator = z.infer<typeof formSchema>


export const StoreModal = () => {

  const storeModal = useStoreModal()

  const form = useForm<createStoreFormValidator>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    },
  })



  const onSubmit = async (values: createStoreFormValidator) => {
    createStore(values)
    // createStore
  }

  const { isLoading, mutate: createStore } = useMutation({
    mutationFn: storeService.createStore,
    onSuccess: () => {
      toast.success('Your store was created successfully')
      form.reset()
    },
    onError: (error) => {
      toast.error(`${error}`)
    }
  })



  return <Modal
    title="Create store"
    description="Add a new store to manage products and categories"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}
  >
    <div>
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder='E-commerce' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
              <Button disabled={isLoading} variant='secondary' onClick={storeModal.onClose}>Cancel</Button>
              <Button disabled={isLoading} type='submit'>Create</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  </Modal>
}