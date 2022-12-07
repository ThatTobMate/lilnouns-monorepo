import { prisma } from '../api';
import { Comment } from '@prisma/client';
import { calculateConsensus } from './ideas';
import { getIsClosed, calculateNetVotes, calculateAllVotes } from '../graphql/utils/queryUtils';

class UserService {
  static async allUsers() {
    try {
      const users = await prisma.user.findMany({
        include: {
          votes: {
            include: {
              idea: true,
            },
          },
          _count: {
            select: { comments: true, votes: true, ideas: true },
          },
        },
      });

      return users;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUserAggregations({ wallet }: { wallet: string }) {
    try {
      const userIdeas = await prisma.idea.findMany({
        where: {
          creatorId: wallet,
        },
        include: {
          votes: {
            include: {
              voter: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      });

      const userAggregations = calculateNetVotes(userIdeas);

      return userAggregations;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUser(wallet: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          wallet,
        },
        include: {
          votes: {
            include: {
              idea: true,
            },
          },
          _count: {
            select: { comments: true, ideas: true },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUserComments({ sortBy, wallet }: { sortBy?: string; wallet: string }) {
    const SORT_FILTERS: { [key: string]: any } = {
      LATEST: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      OLDEST: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    };

    try {
      const comments = await prisma.comment.findMany({
        where: {
          authorId: wallet,
        },
        ...SORT_FILTERS[sortBy || 'LATEST'],
        include: {
          idea: {
            include: {
              tags: true,
            },
          },
          parent: true,
        },
      });

      const commentData = comments.map((comment: any) => {
        if (comment.idea) {
          let votecount = comment.idea.netVotes || 0;
          let closed = comment.idea.locked;
          if (!closed) {
            const { count } = calculateAllVotes(comment.idea.votes || []);
            votecount = count;
            closed = getIsClosed(comment.idea);
          }

          const consensus = calculateConsensus(comment.idea, votecount);

          return { ...comment, idea: { ...comment.idea, votecount, consensus, closed } };
        }
        return comment;
      });

      return commentData;
    } catch (e) {
      throw e;
    }
  }
}

export default UserService;
