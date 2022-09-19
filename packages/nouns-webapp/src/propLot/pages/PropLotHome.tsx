import { Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory } from 'react-router-dom';
import { useRef } from 'react';
import clsx from 'clsx';
import { useAccountVotes } from '../../wrappers/nounToken';
import classes from './PropLotHome.module.css';
import { useIdeas } from '../../hooks/useIdeas';
import { useQuery } from '@apollo/client';
import { GET_PROPLOT_QUERY } from '../graphql/propLotQuery';
import { v4 } from 'uuid';

import {
  getPropLot,
  getPropLot_propLot_sections_UIPropLotFilterBar_filters_options_target_param as TargetParamType,
  getPropLot_propLot_sections_UIPropLotComponentList as UIPropLotComponentListType,
  getPropLot_propLot_sections_UIPropLotFilterBar as UIPropLotFilterBarType,
} from '../graphql/__generated__/getPropLot';

import { FilterInput } from '../graphql/__generated__/globalTypes';

import UIFilter from '../components/UIFilter';
import UIIdeaRow from '../components/UIIdeaRow';

const SUPPORTED_SECTIONS = {
  UIPropLotComponentList: 'UIPropLotComponentList',
  UIPropLotFilterBar: 'UIPropLotFilterBar',
};
const SUPPORTED_COMPONENTS = {
  UIIdeaRow: 'UIIdeaRow',
};

const PropLotHome = () => {
  const { account } = useEthers();
  const history = useHistory();
  const { voteOnIdeaList } = useIdeas();
  const uuid = useRef(v4());

  const { loading, error, data, refetch } = useQuery<getPropLot>(GET_PROPLOT_QUERY, {
    context: { clientName: 'PropLot' },
    variables: {
      options: {
        requestUUID: uuid.current,
        filters: [] as FilterInput[],
      },
    },
  });

  /*
    Filters that are applied to the current response.
    These can be parsed to update the local state after each request to ensure the client + API are in sync.
  */
  const appliedFilters = data?.propLot?.metadata?.appliedFilters || [];

  const handleUpdateFilters = (updatedFilters: TargetParamType[], filterId: string) => {
    /*
      Keep previously applied filters, remove any that match the filterId value.
      Then add the selection of updatedFilters and remove the __typename property.
    */
    const selectedfilters: FilterInput[] = [
      ...appliedFilters.filter((f: any) => {
        return f.key !== filterId;
      }),
      ...updatedFilters,
    ].map(({ __typename, ...rest }) => rest);

    refetch({ options: { requestUUID: v4(), filters: selectedfilters } });
  };

  const nounBalance = useAccountVotes(account || undefined) ?? 0;

  const nullStateCopy = () => {
    if (Boolean(account)) {
      return 'You have no Lil Nouns.';
    }
    return 'Connect wallet to submit an idea.';
  };

  const hasNouns = nounBalance > 0;

  return (
    <div>
      <div>
        <div className={clsx('d-flex', classes.submitIdeaButtonWrapper)}>
          <h3 className={classes.heading}>Ideas</h3>
          {account !== undefined && hasNouns ? (
            <Button className={classes.generateBtn} onClick={() => history.push('/ideas/create')}>
              Submit Idea
            </Button>
          ) : (
            <>
              <div className={classes.nullBtnWrapper}>
                <Button className={classes.generateBtnDisabled}>Submit Idea</Button>
              </div>
            </>
          )}
        </div>
      </div>
      {(!Boolean(account) || !hasNouns) && (
        <div className={classes.nullStateCopy}>{nullStateCopy()}</div>
      )}

      {data?.propLot?.sections?.map((section, idx) => {
        if (section.__typename === SUPPORTED_SECTIONS.UIPropLotComponentList) {
          return (
            <span className="space-y-4" key={`${section.__typename}-${idx}`}>
              {(section as UIPropLotComponentListType).list?.map(item => {
                if (item.__typename === SUPPORTED_COMPONENTS.UIIdeaRow) {
                  return (
                    <UIIdeaRow
                      idea={item.data}
                      key={`idea-${item.data.id}`}
                      voteOnIdea={voteOnIdeaList}
                      nounBalance={nounBalance}
                    />
                  );
                }
                return null;
              })}
            </span>
          );
        }

        if (section.__typename === SUPPORTED_SECTIONS.UIPropLotFilterBar) {
          const { filters } = section as UIPropLotFilterBarType;

          return (
            <div className="mt-2 mb-2 flex flex-col" key={`${section.__typename}-${idx}`}>
              {Boolean(filters) && (
                <div className="flex">
                  {filters?.map((filter: any) => {
                    return (
                      <UIFilter
                        key={filter.id}
                        filter={filter}
                        updateFilters={handleUpdateFilters}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default PropLotHome;