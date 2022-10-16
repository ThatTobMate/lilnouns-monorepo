import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import { QueryGetIdeasArgs, Idea } from '../generated';
import { VirtualTags } from '../../virtual';

const resolvers: IResolvers = {
  Query: {
    getIdeas: async (_parent: any, args: QueryGetIdeasArgs): Promise<Idea[]> => {
      const ideas: Idea[] = await IdeasService.all({ sortBy: args.options.sort as string });
      return ideas;
    },
  },
  Idea: {
    tags: async root => {
      const tags = root.tags;
      const matchingVirtualTags = Object.keys(VirtualTags)
        .filter(key => {
          // @ts-ignore
          const vT = VirtualTags[key];
          return vT.filterFn(root);
        })
        // @ts-ignore
        .map(key => VirtualTags[key]);

      return [...tags, ...matchingVirtualTags];
    },
    comments: async root => {
      const comments = await IdeasService.getIdeaComments(root.id);
      return comments;
    },
    ideaStats: root => root._count,
  },
};

export default resolvers;
