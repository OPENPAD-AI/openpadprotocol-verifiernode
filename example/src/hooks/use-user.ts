import { UserType } from '../types/user-type';

export const useUser = (): UserType => {
  return {
    address: '0x0000000000000000000000000000000000000000',
    verifierWallet: '0x0000000000000000000000000000000000000000'
  };
};
