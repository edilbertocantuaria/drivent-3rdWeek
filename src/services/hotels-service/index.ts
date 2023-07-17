import { Hotel } from '@prisma/client';
import { notFoundError } from '@/errors';
import {notListHotelsError} from '@/errors'
import hotelsRepository from '@/repositories/hotel-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function isUserEnrolledAndPaidTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw notListHotelsError();

}

async function getHotels(userId: number): Promise<Hotel[]> {
  await isUserEnrolledAndPaidTicket(userId);
  
  const hotels = await hotelsRepository.findHotels()

  if (!hotels) throw notFoundError();

  console.log(hotels);
  return hotels;
}

async function getHotelsById(userId: number, hotelId: number): Promise<Hotel> {
  await isUserEnrolledAndPaidTicket(userId);

  const hotel = await hotelsRepository.findHotelById(hotelId)

  if (!hotel) throw notFoundError();

  console.log(hotel);
  return hotel;
}


const hotelsService = {
  getHotels,
  getHotelsById
};

export default hotelsService;