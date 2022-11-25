import { IResolvers } from '@graphql-tools/utils';
import IdeaResolvers from './resolvers/IdeaResolvers';
import PropLotListResolvers from './resolvers/PropLotListResolvers';
import PropLotProfileListResolvers from './resolvers/PropLotProfileListResolvers';

import UserResolvers from './resolvers/UserResolvers';
import { mergeDeep } from '@graphql-tools/utils';
import { GraphQLDateTime } from 'graphql-iso-date';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolverMap: IResolvers = mergeDeep([
  customScalarResolver,
  IdeaResolvers,
  UserResolvers,
  PropLotListResolvers,
  PropLotProfileListResolvers,
]);
export default resolverMap;
