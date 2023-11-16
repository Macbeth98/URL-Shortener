import { UserTier } from '@/utils/enum.type';

export const TIER_LIMITS: { [key in UserTier]: number } = {
  FREE: 5,
  PRO: 10,
  PREMIUM: 20
};
