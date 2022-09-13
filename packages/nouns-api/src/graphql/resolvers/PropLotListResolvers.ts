import IdeasService from '../../services/ideas';

import { IResolvers } from '@graphql-tools/utils';
import { Idea, QueryGetPropLotListArgs, PropLotListResponse, FilterInput, UiIdeaRow, UiFilterPillGroup, UiFilterType, UiDropdownPill, TargetFilterParam, UiSortPillGroup } from '../generated';
const buildTargetParam = (id: string, value: string): TargetFilterParam => ({ param: { id, value } })
const FILTER_IDS = {
  DATE: "date",
  SORT: "sort",
  TAG: "tag",
}

const getSortParam = (appliedFilters: FilterInput[]) => appliedFilters.find((aF: any) => aF.id === FILTER_IDS.SORT) || { id: FILTER_IDS.SORT, value: "LATEST" };
const getDateParam = (appliedFilters: FilterInput[]) => appliedFilters.find((aF: any) => aF.id === FILTER_IDS.DATE);

const resolvers: IResolvers = {
  Query: {
    getPropLotList: async (_parent: any, args: QueryGetPropLotListArgs) => {
      return { appliedFilters: args.options.filters || [], wallet: args.options.wallet, requestUUID: args.options.requestUUID }
    },
  },
  PropLotListResponse: {
    list: async (root) => {
      const sortParam = getSortParam(root.appliedFilters);
      const ideas: Idea[] = await IdeasService.all(sortParam.value);
      const ideaRows: UiIdeaRow[] = ideas.map(idea => {
        const row: UiIdeaRow = {
          data: idea,
          __typename: "UIIdeaRow"
        }

        return row;
      })

      return ideaRows;
    },
    uiFilters: (root) => {
      const dateParam = getDateParam(root.appliedFilters);

      const dropDownPill: UiDropdownPill = {
        __typename: 'UIDropdownPill',
        id: FILTER_IDS.DATE,
        selected: dateParam?.id === FILTER_IDS.DATE,
        label: "Top",
        options: [{
          id: "TODAY",
          selected: dateParam?.value === "TODAY",
          label: "Today",
          target: buildTargetParam(FILTER_IDS.DATE, "TODAY"),
        }],
      };

      const filterPills: UiFilterPillGroup = {
        id: "FILTER_PILLS",
        pills: [dropDownPill],
        type: UiFilterType.MultiSelect,
      }

      // SORT FILTERS

      const sortParam = getSortParam(root.appliedFilters);

      const sortPills: UiSortPillGroup = {
        id: FILTER_IDS.SORT,
        pills: [{
          __typename: 'UITogglePill',
          id: "sort_created",
          options: [
            {
              id: "LATEST",
              selected: sortParam?.value === "LATEST",
              label: "Created",
              target: buildTargetParam(FILTER_IDS.SORT, "LATEST"),
            },
            {
              id: "OLDEST",
              selected: sortParam?.value === "OLDEST",
              label: "Created",
              target: buildTargetParam(FILTER_IDS.SORT, "OLDEST"),
            }
          ],
        },
        {
          __typename: 'UITogglePill',
          id: "sort_votes",
          options: [
            {
              id: "VOTES_ASC",
              selected: sortParam?.value === "VOTES_ASC",
              label: "Votes",
              target: buildTargetParam(FILTER_IDS.SORT, "VOTES_ASC"),
            },
            {
              id: "VOTES_DESC",
              selected: sortParam?.value === "VOTES_DESC",
              label: "Votes",
              target: buildTargetParam(FILTER_IDS.SORT, "VOTES_DESC"),
            }
          ],
        },
      ],
      }

      return {
        sortPills,
        filterPills,
      };
    },
    metadata: (root) => ({
      requestUUID: root.requestUUID,
      appliedFilters: root.appliedFilters,
    })
  },
};

export default resolvers;
