import db from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {

    const { userId } = auth()
    const { label, imageUrl } = await req.json()

    const { storeId } = params




    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!label || !imageUrl) {
      return new NextResponse(`Label and ImageUrl is required`, { status: 400 })
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


    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      }
    })


    return NextResponse.json(billboard)

  } catch (err) {
    console.log('[BILLBOARDS_POST]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function GET(
  req: Request, { params }: { params: { storeId: string, billboardId: string } }
) {
  try {

    const { userId } = auth()

    const { storeId } = params


    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId,
      }
    })


    return NextResponse.json(billboards)

  } catch (err) {
    console.log('[BILLBOARDS_GET]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}