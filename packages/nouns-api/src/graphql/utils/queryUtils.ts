import moment from 'moment';

export const FILTER_IDS = {
  DATE: 'date',
  SORT: 'sort',
  TAG: 'tag',
  PROFILE_TAB: 'profile_tab',
};

export const buildFilterParam = (id: string, value: string) => {
  return `${id}=${value}`;
};

export const parseFilterParam = (param: string) => {
  if (!param) {
    return undefined;
  }
  const [id, value] = param.split('=');

  return { id, value };
};

export const getSortParam = (appliedFilters: string[]) =>
  appliedFilters.find((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.SORT) ||
  buildFilterParam(FILTER_IDS.SORT, 'LATEST');

export const getDateParam = (appliedFilters: string[]) =>
  appliedFilters.find((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.DATE);

export const getTagParams = (appliedFilters: string[]) =>
  appliedFilters.filter((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.TAG);

export const getProfileTabParams = (appliedFilters: string[]) =>
  appliedFilters.find((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.PROFILE_TAB) ||
  buildFilterParam(FILTER_IDS.PROFILE_TAB, 'SUBMISSIONS');

export const DATE_FILTERS: { [key: string]: any } = {
  TODAY: {
    value: buildFilterParam(FILTER_IDS.DATE, 'TODAY'),
    displayName: 'Today',
    filterFn: () => ({
      gte: moment().startOf('day').toISOString(),
      lte: moment().endOf('day').toISOString(),
    }),
  },
  THIS_WEEK: {
    value: buildFilterParam(FILTER_IDS.DATE, 'THIS_WEEK'),
    displayName: 'This week',
    filterFn: () => ({
      gte: moment().startOf('week').toISOString(),
      lte: moment().endOf('week').toISOString(),
    }),
  },
  THIS_MONTH: {
    value: buildFilterParam(FILTER_IDS.DATE, 'THIS_MONTH'),
    displayName: 'This month',
    filterFn: () => ({
      gte: moment().startOf('month').toISOString(),
      lte: moment().endOf('month').toISOString(),
    }),
  },
  ALL_TIME: {
    value: buildFilterParam(FILTER_IDS.DATE, 'ALL_TIME'),
    displayName: 'All time',
    filterFn: () => ({
      gte: moment(new Date('2022-01-01')).toISOString(),
      lte: moment().endOf('day').toISOString(),
    }),
  },
};

export const getIsClosed = (idea: any) => {
  // If you change the closing timeframe then make sure to update the cron task too in app/tasks/lock-ideas.ts
  return moment(idea.createdAt).isBefore(moment().subtract(7, 'days').toISOString());
};

export const calculateAllVotes = (votes: any) => {
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

export const calculateNetVotes = (ideas: any) => {
  let netVotes = 0;
  let netUpvotes = 0;
  let netDownvotes = 0;

  ideas.forEach((idea: any) => {
    if (idea.locked) {
      netVotes += idea.netVotes;
      netUpvotes += idea.netUpvotes;
      netDownvotes += idea.netDownvotes;
    } else {
      const { count, upvotes, downvotes } = calculateAllVotes(idea.votes);

      netVotes += count;
      netUpvotes += upvotes;
      netDownvotes += downvotes;
    }
  });

  return { netVotes, netUpvotes, netDownvotes };
};
