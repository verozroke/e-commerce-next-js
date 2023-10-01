import { FC } from 'react'
import OrderClient from './compontents/client'
import db from '@/lib/prisma.db'
import { OrderColumn } from './compontents/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async ({ params }) => {

  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedOrders: OrderColumn[] = orders.map(order => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(order.orderItems.reduce((acc, orderItem): number => {
      return acc + Number(orderItem.product.price)
    }, 0)),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, 'MMMM dd, yyyy'),
  }))

  return <div className="flex flex-col">
    <div className="flex-1 space-y-4 p-8 pt-6">
      <OrderClient data={formattedOrders} />
    </div>
  </div>
}
export default page