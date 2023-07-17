import faker from '@faker-js/faker';
//import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

export async function createFakeHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.middleName(),
      image: faker.image.imageUrl(),
    }
  });
}

export async function createFakeRoom(hotelId: number) {

  return prisma.room.create({
    data: {
      name: "suite standard",
      capacity: 3,
      hotelId: hotelId
    }
  })
}
