import { UserService } from './../service/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../models/user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() user: User): Promise<Object> {
    const jwt = await this.userService.login(user);
    return { access_token: jwt };
  }

  @Post()
  async create(@Body() user: User): Promise<User | Object> {
    try {
      return await this.userService.create(user);
    } catch (err) {
      return { error: err.message };
    }
  }

  @Get()
  async findAll(@Param() params): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(Number(id));
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<any> {
    return await this.userService.updateOne(Number(id), user);
  }
}
