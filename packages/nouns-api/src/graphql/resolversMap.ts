import { IResolvers } from '@graphql-tools/utils';
import IdeaResolvers from './resolvers/IdeaResolvers';
import PropLotListResolvers from './resolvers/PropLotListResolvers';
import PropLotProfileListResolvers from './resolvers/PropLotProfileListResolvers';

import UserResolvers from './resolvers/UserResolvers';
import { mergeDeep } from '@graphql-tools/utils';

const resolverMap: IResolvers = mergeDeep([
  IdeaResolvers,
  UserResolvers,
  PropLotListResolvers,
  PropLotProfileListResolvers,
]);
export default resolverMap;
