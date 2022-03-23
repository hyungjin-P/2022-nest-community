import { IsNotEmpty } from 'class-validator';

export class UserModifyServiceTermDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  agreementAge: boolean;

  @IsNotEmpty()
  agreementPrivacy: boolean;

  @IsNotEmpty()
  agreementServiceTerms: boolean;

  @IsNotEmpty()
  agreementMarketing: boolean;
}
