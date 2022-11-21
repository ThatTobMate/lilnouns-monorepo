import { prisma } from '../api';

const calculateAllVotes = (votes: any) => {
  let count = 0;
  let upvotes = 0;
  let downvotes = 0;
  const calc = (acc: number, vote: any) => acc + vote.direction * vote.voter.lilnounCount;
  votes.forEach((vote: any) => {
    if (vote.direction === 1) {
      upvotes = calc(upvotes, vote);
    }
    if (vote.direction === -1) {
      downvotes = calc(downvotes, vote);
    }
    count = calc(count, vote);
  });

  return { count, upvotes, downvotes };
};

const calculateNetVotes = (ideas: any) => {
  let netVotes = 0;
  let netUpvotes = 0;
  let netDownvotes = 0;

  ideas.forEach((idea: any) => {
    const { count, upvotes, downvotes } = calculateAllVotes(idea.votes);

    netVotes += count;
    netUpvotes += upvotes;
    netDownvotes += downvotes;
  });

  return { netVotes, netUpvotes, netDownvotes };
};

class UserService {
  static async allUsers() {
    try {
      const users = await prisma.user.findMany({
        include: {
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
}

export default UserService;
