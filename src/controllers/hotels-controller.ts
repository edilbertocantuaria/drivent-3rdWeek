import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels(userId);

    if (!hotels) return res.status(httpStatus.NOT_FOUND)

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'NotListHotelsError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);


    return res.sendStatus(httpStatus.BAD_REQUEST)
  }
}


export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;

  try {

    const hotel = await hotelsService.getHotelsById(userId, Number(hotelId));
    res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'NotListHotelsError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    return res.sendStatus(httpStatus.BAD_REQUEST)
  }
}
