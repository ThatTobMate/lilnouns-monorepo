import UserService from '../services/user';
import IdeasService from '../services/ideas';

import { IResolvers } from '@graphql-tools/utils';

const resolvers: IResolvers = {
  Query: {
    getIdeas: async (_parent: any, args: any) => {
      const ideas = await IdeasService.all(args.options.sort as string);
      return ideas;
    },
    getAllUsers: async (_parent: any) => {
      const users = await UserService.allUsers();
      return users;
    },
    getUser: async (_parent: any, args: any) => {
      const users = await UserService.getUser(args.options.wallet as string);
      return users;
    },
  },
};

export default resolvers;
