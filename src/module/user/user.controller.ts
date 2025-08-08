import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPayload } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 查询所有用户
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query("username") username: string | undefined,
    @Query("email") email: string | undefined,
    @Query("phone") phone: string | undefined,
  ): Promise<User[]> {
    return this.userService.findAll(username, email, phone);
  }

  // 获取用户详情
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number): Promise<User | null> {
    return this.userService.findById(id);
  }

  // 创建用户
  @Post()
  async create(@Body() createUserDto: UserPayload): Promise<User> {
    const user = this.userService.create(createUserDto)
    return plainToInstance(User, user);
  }

  // 更新用户
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() user: UserPayload): Promise<User | null> {
    return this.userService.update(id, user);
  }

  // 删除用户
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
