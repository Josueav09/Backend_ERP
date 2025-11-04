import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(private readonly httpService: HttpService) {}

  private getServiceBaseUrl(service: string): string {
    const envUrls = {
      auth: process.env.AUTH_SERVICE_URL || 'http://growvia-app-auth:3001',
      user: process.env.USER_SERVICE_URL || 'http://growvia-app-user:3002',
      sales: process.env.SALES_SERVICE_URL || 'http://growvia-app-sales:3003',
      traceability: process.env.TRACEABILITY_SERVICE_URL || 'http://growvia-app-traceability:3007'
    };
    return envUrls[service];
  }

  @Get()
  async checkHealth() {
    const services = ['auth', 'user', 'sales', 'traceability'];
    const serviceStatus = {};

    // Verificar cada servicio
    for (const service of services) {
      try {
        const url = this.getServiceBaseUrl(service);
        const startTime = Date.now();
        
        const response = await firstValueFrom(
          this.httpService.get(`${url}/health`, { 
            timeout: 10000 
          })
        );
        
        const responseTime = Date.now() - startTime;
        
        serviceStatus[service] = {
          status: 'UP',
          responseTime: `${responseTime}ms`,
          url: url,
          data: response.data
        };
      } catch (error) {
        serviceStatus[service] = {
          status: 'DOWN',
          error: error.message,
          code: error.code,
          url: this.getServiceBaseUrl(service),
          details: error.response?.data || 'No response'
        };
      }
    }

    return {
      status: 'OK',
      service: 'API Gateway',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: serviceStatus
    };
  }
}