import db from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {

    const { userId } = auth()
    const { name, billboardId } = await req.json()

    const { storeId } = params




    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name || !billboardId) {
      return new NextResponse(`Name and BillboardId is required`, { status: 400 })
    }

    if (!storeId) {
      return new NextResponse(`StoreId is required`, { status: 400 })
    }


    const isExist = db.store.findUnique({
      where: {
        id: storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }


    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId,
      }
    })


    return NextResponse.json(category)

  } catch (err) {
    console.log('[CATEGORIES_POST]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function GET(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {


    const { storeId } = params


    const categories = await db.category.findMany({
      where: {
        storeId,
      }
    })

    console.log(categories)


    return NextResponse.json(categories)

  } catch (err) {
    console.log('[CATEGORIES_GET]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}