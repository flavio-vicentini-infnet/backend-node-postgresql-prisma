import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

export const Database = new PrismaClient();
