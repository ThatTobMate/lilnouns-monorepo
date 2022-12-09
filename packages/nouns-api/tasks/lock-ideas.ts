import cron from 'node-cron';
import moment from 'moment';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { calculateAllVotes } from '../src/graphql/utils/queryUtils';

// Run every hour;
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('RUNNING CRON');
    const sevenDaysAgo = moment().subtract(0, 'days').toISOString();

    const ideas = await prisma.idea.findMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
        locked: false,
      },
      include: {
        votes: {
          include: {
            voter: true,
          },
        },
      },
    });

    if (Boolean(ideas.length)) {
      for (const idea of ideas) {
        console.log('LOCKING IDEA', idea.id);
        const { count, upvotes, downvotes } = calculateAllVotes(idea.votes);
        await prisma.idea.update({
          where: { id: idea.id },
          data: {
            locked: true,
            netVotes: count,
            netUpvotes: upvotes,
            netDownvotes: downvotes,
          },
        });
      }

      console.log(`COMPLETED LOCKING ${ideas.length} IDEAS`);
    } else {
      console.log('NO IDEAS TO LOCK');
    }
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
});
