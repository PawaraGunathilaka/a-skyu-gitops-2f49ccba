import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Req,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { SwaggerSpecService } from './swagger-spec.service';
import { SwaggerSpecDto } from './dto/swagger-spec.dto';
import { UpdateSwaggerSpecDto } from './dto/update-swagger-spec.dto';
import { ValidatorPipe } from 'src/common/pipes/validator.pipe';
import { SwaggerSpecSchema } from './dto/schema/swagger-spec.schema';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { SwaggerSpec } from './entities/swagger-spec.entity';
import { Request } from 'express';
import { UpdateSwaggerSpecSchema } from './dto/schema/swagger-spec-update.schema';

@Controller('swagger-specs')
export class SwaggerSpecController {
  constructor(private readonly swaggerSpecService: SwaggerSpecService) {}

  @UsePipes(new ValidatorPipe<SwaggerSpecDto>(SwaggerSpecSchema))
  @Post()
  async create(
    @Req() request: Request,
    @Body() createSwaggerSpecDto: SwaggerSpecDto,
  ) {
    const response = await this.swaggerSpecService.create(
      request,
      createSwaggerSpecDto,
    );
    return new ApiResponseDto<SwaggerSpec>({
      message: `${
        response
          ? 'Swagger spec created successfully. '
          : 'Swagger spec creation failed'
      }`,
      success: response ? true : false,
      data: response,
    });
  }

  @Get()
  async findAllByAppId(@Req() request: Request) {
    const response = await this.swaggerSpecService.findAllByAppId(request);

    return new ApiResponseDto<SwaggerSpec[]>({
      message: `${
        response.length > 0
          ? 'Successfully Retrieved swagger specs.'
          : `No swagger specs found.`
      }`,
      success: response ? true : false,
      data: response,
    });
  }

  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    const response = await this.swaggerSpecService.findOne(request, id);
    return new ApiResponseDto<SwaggerSpec>({
      message: `${
        response
          ? 'Successfully Retrieved swagger spec.'
          : `No swagger spec found with id: ${id}`
      }`,
      success: response ? true : false,
      data: response,
    });
  }

  @UsePipes(new ValidatorPipe<UpdateSwaggerSpecDto>(UpdateSwaggerSpecSchema))
  @Put()
  async update(
    @Req() request: Request,
    @Body() updateSwaggerSpecDto: UpdateSwaggerSpecDto,
  ) {
    const response = await this.swaggerSpecService.update(
      request,
      updateSwaggerSpecDto,
    );
    return new ApiResponseDto<SwaggerSpec>({
      message: `${
        response
          ? 'Swagger spec updated successfully.'
          : `Update failed for swagger spec : ${updateSwaggerSpecDto.id}`
      }`,
      success: response ? true : false,
      data: response,
    });
  }

  @Delete(':id')
  async remove(@Req() request: Request, @Param('id') id: string) {
    // Check if id is provided in query params
    if (!id) {
      throw new BadRequestException(' Id must be provided.');
    }

    const response = await this.swaggerSpecService.remove(request, id);
    return new ApiResponseDto<string>({
      message: `Deleted swagger spec : ${id}`,
      data: response,
    });
  }
}
