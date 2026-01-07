import { envConfig } from './env.config';

export const envFlags = {
    isProduction: envConfig.envProduction === 'true',
    allowUserOperation: envConfig.allowUserOperation === 'true',
};