import { Controller, Get, Post, Patch, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('suppliers')
@Controller('suppliers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  async getSuppliers(@CurrentUser() user: any) {
    return this.suppliersService.getSuppliers(user.tenantId, user.token);
  }

  @Post()
  async createSupplier(@Body() supplierData: any, @CurrentUser() user: any) {
    return this.suppliersService.createSupplier(user.tenantId, supplierData, user.token);
  }

  @Patch(':id')
  async updateSupplier(@Param('id') supplierId: string, @Body() supplierData: any, @CurrentUser() user: any) {
    return this.suppliersService.updateSupplier(supplierId, supplierData, user.token);
  }

  @Delete(':id')
  async deleteSupplier(@Param('id') supplierId: string, @CurrentUser() user: any) {
    return this.suppliersService.deleteSupplier(supplierId, user.token);
  }
}
