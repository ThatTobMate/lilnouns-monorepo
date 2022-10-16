import { Idea } from '@prisma/client';

export const VirtualTags = {
  NEW: {
    type: 'NEW',
    label: 'New',
    filterFn: (idea: Idea) => {
      const today = new Date();
      const dTime = today.getTime() - idea.createdAt.getTime();
      const dDays = dTime / (1000 * 3600 * 24);

      return dDays < 7;
    },
  },
};
