import { FC, useState } from 'react'
import { ProductColumn } from './columns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import AlertModal from '../[productId]/components/alert-modal'
import productService from '@/services/product.service'

interface CellActionProps {
  data: ProductColumn,

}

const CellAction: FC<CellActionProps> = ({ data }) => {

  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = useState<boolean>(false);


  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Product ID copied the clipboard')
  }


  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useMutation({
    mutationFn: async (storeId: string) => {
      return productService.deleteProduct(storeId, data.id as string)
    },
    onSuccess: () => {
      toast.success('Your product was deleted successfully')
      router.push(`/${params.storeId}/products`)
      setOpen(false)
    },
    onError: (err: any) => {
      toast.error(`${err}`)
      setOpen(false)
    }
  })

  return <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={() => deleteProduct(params.storeId as string)}
      loading={isDeleteLoading}

    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className='mr-2 h-4 w-4' />
          Copy id
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
          <Edit className='mr-2 h-4 w-4' />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}

export default CellAction