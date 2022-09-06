import { IResolvers } from '@graphql-tools/utils';
import IdeaResolvers from './resolvers/IdeaResolvers';
import UserResolvers from './resolvers/UserResolvers';

const resolverMap: IResolvers = { ...IdeaResolvers, ...UserResolvers };
export default resolverMap;
