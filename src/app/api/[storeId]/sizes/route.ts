import db from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {

    const { userId } = auth()
    const { name, value } = await req.json()

    const { storeId } = params




    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name || !value) {
      return new NextResponse(`Name and Value is required`, { status: 400 })
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


    const size = await db.size.create({
      data: {
        name,
        value,
        storeId,
      }
    })


    return NextResponse.json(size)

  } catch (err) {
    console.log('[SIZES_POST]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function GET(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {


    const { storeId } = params


    const sizes = await db.size.findMany({
      where: {
        storeId,
      }
    })


    return NextResponse.json(sizes)

  } catch (err) {
    console.log('[SIZES_GET]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}