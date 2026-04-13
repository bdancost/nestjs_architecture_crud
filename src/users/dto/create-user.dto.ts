import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  declare email: string;
  declare name: string;
}
