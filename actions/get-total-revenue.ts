import db from "@/lib/prisma.db"

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  })

  const totalRevenue = paidOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return acc + Number(item.product.price)
    }, 0)

    return acc + orderTotal
  }, 0)

  return totalRevenue
}