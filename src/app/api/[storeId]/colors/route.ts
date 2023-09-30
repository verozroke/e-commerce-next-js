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


    const color = await db.color.create({
      data: {
        name,
        value,
        storeId,
      }
    })


    return NextResponse.json(color)

  } catch (err) {
    console.log('[COLORS_POST]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function GET(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {

    const { userId } = auth()

    const { storeId } = params


    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const colors = await db.color.findMany({
      where: {
        storeId,
      }
    })


    return NextResponse.json(colors)

  } catch (err) {
    console.log('[COLORS_GET]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}