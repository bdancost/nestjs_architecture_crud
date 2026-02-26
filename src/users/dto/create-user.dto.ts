import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  declare name: string;
  declare email?: string;
}
