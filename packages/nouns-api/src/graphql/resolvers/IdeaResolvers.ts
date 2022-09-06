import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import { QueryGetIdeasArgs, Idea } from '../generated';

const resolvers: IResolvers = {
  Query: {
    getIdeas: async (_parent: any, args: QueryGetIdeasArgs): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.all(args.options.sort as string);
      return ideas;
    },
  },
};

export default resolvers;
