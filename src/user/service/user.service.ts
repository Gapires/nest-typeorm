import { UserEntity } from './../models/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(user: User): Promise<User> {
    const passwordHash = await this.authService.hashPassword(user.password);

    const newUser = new UserEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.userName = user.userName;
    newUser.password = passwordHash;

    const savedUser = await this.userRepository.save(newUser);

    const { password, ...result } = savedUser;
    return result;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    users.forEach((user: User) => delete user.password);
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    const { password, ...result } = user;
    return result;
  }

  async deleteOne(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  async updateOne(id: number, user: User): Promise<any> {
    delete user.email;
    delete user.password;
    return await this.userRepository.update(id, user);
  }

  async login(user: User): Promise<string> {
    const validatedUser = await this.validateUser(user.email, user.password);

    if (validatedUser) {
      return await this.authService.generateJWT(validatedUser);
    } else {
      return 'Wrong Credentials';
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    const compare = await this.authService.comparePasswords(
      password,
      user.password,
    );

    if (compare) {
      const { password, ...result } = user;
      return result;
    } else {
      throw Error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }
}
