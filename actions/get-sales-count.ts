import db from "@/lib/prisma.db"

export const getSalesCount = async (storeId: string) => {
  const salesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true
    }
  })



  return salesCount
}