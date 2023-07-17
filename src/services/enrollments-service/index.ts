import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import httpStatus from 'http-status';
import { invalidDataError, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { isValid } from '@brazilian-utils/brazilian-utils/dist/utilities/inscricao-estadual';
import { isValidEmail } from '@brazilian-utils/brazilian-utils';
import { error } from 'console';


async function getAddressFromCEP(cep: string) {
  //console.log("service");
  //console.log(cep)

  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  if (!result.data || result.data.erro) {
    throw notFoundError();
  }

  const formattedResult: {
    logradouro: string,
    complemento: string,
    bairro: string,
    cidade: string,
    uf: string
  } = {
    logradouro: (result.data.logradouro === undefined ? '' : result.data.logradouro),
    complemento: (result.data.complemento === undefined ? '' : result.data.complemento),
    bairro: (result.data.bairro === undefined ? '' : result.data.bairro),
    cidade: (result.data.localidade === undefined ? '' : result.data.localidade),
    uf: (result.data.uf === undefined ? '' : result.data.uf)
  }

  //console.log(formattedResult);

  return formattedResult;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;


async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);
  //console.log(address.cep)
  const cep = address.cep.replace("-", "")

  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);
  if (result.status !== 200 || result.data.erro) {
    throw notFoundError();
  };


  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};

export default enrollmentsService;
