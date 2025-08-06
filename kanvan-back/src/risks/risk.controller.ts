import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RiskService } from './risk.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('api/risks')
@UseGuards(AuthGuard('jwt')) // protege todas las rutas con JWT
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post()
  async create(
    @Body() createRiskDto: CreateRiskDto,
    @CurrentUser() user: User,
  ) {
    return this.riskService.create(createRiskDto, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRiskDto: UpdateRiskDto,
    @CurrentUser() user: User,
  ) {
    return this.riskService.update(id, updateRiskDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.riskService.delete(id, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.riskService.findById(id, user);
  }

  // Para obtener todos, opcionalmente filtrar por projectId query param
  @Get()
  async findAll(
    @Query('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.riskService.findAll(projectId, user);
  }
}
