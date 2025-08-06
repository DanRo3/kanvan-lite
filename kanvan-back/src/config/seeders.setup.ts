import { INestApplication } from '@nestjs/common';
import { OwnerSeederService } from '../modules/user/owner-seeder.service';

export default async function setupSeeders(app: INestApplication) {
  const userSeederService = app.get(OwnerSeederService);
  await userSeederService.createOwnerUser();
}
