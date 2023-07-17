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

export async function createFakeRoom() {
  const capacity = Math.round(faker.random.number({ min: 1, max: 4 }));

  const roomId = Math.round(faker.random.number({ min: 1, max: 1000 }));

  return prisma.room.create({
    data: {
      name: "suite standard",
      capacity: capacity,
      hotelId: roomId
    }
  })
}
