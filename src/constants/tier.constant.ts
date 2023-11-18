import { UserTier } from '@/utils/enum.type';

export const TIER_LIMITS: { [key in UserTier]: number } = {
  FREE: 5,
  PRO: 100,
  PREMIUM: 2000
};
