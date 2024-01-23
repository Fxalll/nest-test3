// src/logical/commodity/commodity.controller.js
import { Controller, Request, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommodityService } from './commodity.service';
import { RbacInterceptor } from '../../interceptor/rbac/rbac.interceptor';
import { roleConstans as role } from '../auth/constants'; // 引入角色常量
import { RbacGuard } from '../../guards/rbac/rbac.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('commodity') // 添加 接口标签 装饰器
@Controller('commodity')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) { }

  // 查询商品列表
  @UseGuards(new RbacGuard(role.HUMAN)) // 注意：RbacGuard 要在 AuthGuard 的上面，不然获取不到用户信息。
  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async queryColumnList(@Body() body: any) {
    return await this.commodityService.queryCommodityList(body);
  }

  // 新建商品
  @UseGuards(new RbacGuard(role.DEVELOPER))
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createCommodity(@Body() body: any, @Request() req: any) {
    return await this.commodityService.createCommodity(body, req.user.username);
  }

  // 修改商品
  @UseGuards(new RbacGuard(role.DEVELOPER))
  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateCommodity(@Body() body: any, @Request() req: any) {
    return await this.commodityService.updateCommodity(body, req.user.username);
  }

  // 删除商品
  @UseGuards(new RbacGuard(role.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  async deleteCommodity(@Body() body: any) {
    return await this.commodityService.deleteCommodity(body);
  }
}
