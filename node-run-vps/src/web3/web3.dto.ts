import { IsArray, IsNotEmpty } from 'class-validator';
export class UpdateOperaterAdddressDto {
  @IsArray()
  @IsNotEmpty()
  nfts: Array<{ tokenId: string; tokenAddress: string }>;
}
