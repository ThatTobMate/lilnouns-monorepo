import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { v4 } from 'uuid';
import { Alert, Button } from 'react-bootstrap';
import { useEthers } from '@usedapp/core';
import { useHistory, useParams } from 'react-router-dom';

import Davatar from '@davatar/react';

import { useEffect } from 'react';
import { useAccountVotes, useNounTokenBalance } from '../../wrappers/nounToken';
import { useAuth } from '../../hooks/useAuth';
import { useLazyQuery } from '@apollo/client';
import propLotClient from '../graphql/config';
import { GET_PROPLOT_PROFILE_QUERY } from '../graphql/propLotProfileQuery';
import ProfileTabFilters from '../components/ProfileTabFilters';
import IdeaRow from '../components/IdeaRow';
import {
  getPropLotProfile,
  getPropLotProfile_propLotProfile_profile_user_userStats as UserStats,
} from '../graphql/__generated__/getPropLotProfile';
import DropdownFilter from '../components/DropdownFilter';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import useSyncURLParams from '../utils/useSyncUrlParams';

// Subgraph query to fetch lil nouns by owner, not working locally?
// export const NOUNS_BY_OWNER_SUB = gql`
//   query nouns($id: String!) {
//     nouns(where: { owner: $id }) {
//       id
//       seed {
//         background
//         body
//         accessory
//         head
//         glasses
//       }
//       owner {
//         id
//       }
//     }
//   }
// `;

// Zora API query to fetch lil nouns by owner. Works locally but can/do we use Zora? Also no delegation data.
// export const NOUNS_BY_OWNER_ZORA = gql`
//   query tokens($id: String!) {
//     tokens(
//       where: {
//         ownerAddresses: [$id]
//         collectionAddresses: ["0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b"]
//       }
//     ) {
//       nodes {
//         token {
//           owner
//           tokenId
//         }
//       }
//     }
//   }
// `;

const ProfileCard = (props: { title: string; count: number }) => {
  return (
    <div className="font-propLot whitespace-nowrap py-[8px] px-[16px] gap-[4px] sm:p-[16px] sm:gap-[8px] bg-white border-solid border border-[#e2e3e8] rounded-[16px] box-border flex flex-1 flex-col justify-start">
      <span className="font-semibold text-[12px] text-[#8C8D92]">{props.title}</span>
      <span className="font-extrabold text-[24px] text-[#212529]">{props.count}</span>
    </div>
  );
};

const PropLotUserProfile = () => {
  const { id } = useParams() as { id: string };
  const { account, library: provider } = useEthers();
  const { getAuthHeader } = useAuth();

  const [getPropLotProfileQuery, { data, refetch }] = useLazyQuery<getPropLotProfile>(
    GET_PROPLOT_PROFILE_QUERY,
    {
      context: {
        clientName: 'PropLot',
        headers: {
          ...getAuthHeader(),
          'proplot-tz': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
      client: propLotClient,
    },
  );

  // REVIST LATER WHEN ADDING ONCHAIN DATA AND PROFILE IMAGES
  // const [getNounsByOwnerQuery, { data: getNounsByOwnerData }] = useLazyQuery(NOUNS_BY_OWNER_ZORA, {
  //   context: {
  //     clientName: 'ZoraAPI',
  //   },
  //   client: zoraClient,
  // });

  // const [getNounsByOwnerQuerySub, { data: getNounsByOwnerDataSub }] = useLazyQuery(
  //   NOUNS_BY_OWNER_SUB,
  //   {
  //     context: {
  //       clientName: 'LilNouns',
  //     },
  //     client: defaultClient,
  //   },
  // );

  /*
    Parse the query params from the url on page load and send them as filters in the initial
    PropLot query.
  */
  useEffect(() => {
    const urlParams = window.location.search;
    const currentURLParams = urlParams
      .substring(1)
      .split('&')
      .filter(str => Boolean(str));

    getPropLotProfileQuery({
      variables: {
        options: {
          wallet: id,
          requestUUID: v4(),
          filters: currentURLParams,
        },
      },
    });

    // getNounsByOwnerQuery({
    //   variables: {
    //     id: '0x8B488CC76a38777c2f7B76eB6D49bDF430132Ac9',
    //   },
    // });

    // getNounsByOwnerQuerySub({
    //   variables: {
    //     id: '0x8B488CC76a38777c2f7B76eB6D49bDF430132Ac9',
    //   },
    // });
  }, []);

  /*
    Filters that are applied to the current response.
    These can be parsed to update the local state after each request to ensure the client + API are in sync.
  */
  const appliedFilters = data?.propLotProfile?.metadata?.appliedFilters || [];
  useSyncURLParams(appliedFilters);

  const handleUpdateFilters = (updatedFilters: string[], filterId: string) => {
    /*
      Keep previously applied filters, remove any that match the filterId value.
      Then add the selection of updatedFilters and remove the __typename property.
    */
    const selectedfilters: string[] = [
      ...appliedFilters.filter((f: string) => {
        return !f.includes(`${filterId}=`);
      }),
      ...updatedFilters,
    ];

    refetch({ options: { wallet: id, requestUUID: v4(), filters: selectedfilters } });
  };

  const nounBalanceWithDelegates = useAccountVotes(account || undefined) ?? 0;
  const nounWalletBalance = useNounTokenBalance(account ?? '') ?? 0;

  const isAccountOwner = account !== undefined && account === id;

  // const shuffledNounIds = pseudoRandomPredictableShuffle(nounIds, +new Date());
  // const paddedNounIds = shuffledNounIds
  //   .map((nounId: string) => {
  //     return <StandaloneNounCircular nounId={EthersBN.from(nounId)} />;
  //   })
  //   .concat(Array(5).fill(<GrayCircle />))
  //   .slice(0, 5);

  const ens = useReverseENSLookUp(id);
  const shortAddress = useShortAddress(id);

  const buildProfileCards = (userStats: UserStats) => {
    return (
      <>
        {userStats.totalIdeas && (
          <ProfileCard count={userStats.totalIdeas} title={'Prop Lot submissions'} />
        )}
        {userStats.upvotesReceived && (
          <ProfileCard count={userStats.upvotesReceived || 0} title={'Upvotes received'} />
        )}
        {typeof userStats.downvotesReceived === 'number' && (
          <ProfileCard count={userStats.downvotesReceived || 0} title={'Downvotes received'} />
        )}
        {userStats.netVotesReceived && (
          <ProfileCard count={userStats.netVotesReceived || 0} title={'Net votes'} />
        )}
      </>
    );
  };

  return (
    <Section fullWidth={false} className="ml-[16px] mr-[16px]">
      <Col lg={10} className="ml-auto mr-auto">
        <Row>
          <div>
            <span className="text-[#8C8D92] flex flex-row items-center justify-center sm:justify-start">
              <span className="text-[24px] font-londrina">Profile</span>
            </span>
          </div>
          <div className="flex flex-col mb-[48px]">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex flex-row justify-end">
                <h1 className="font-londrina text-[48px] sm:text-[56px] text-[#212529] font-normal">
                  {ens || shortAddress}
                </h1>
              </div>
              <div className="flex flex-col justify-end gap-[16px]">
                <Davatar size={32} address={id} provider={provider} />
                <div className="flex flex-1 text-[12px] text-[#8C8D92] font-semibold whitespace-pre">
                  Lil nouns owned:<span className="text-[#212529]"> {nounWalletBalance}</span>
                  {` delegated:`}
                  <span className="text-[#212529]">
                    {` ${nounBalanceWithDelegates - nounWalletBalance}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Row>
        <div className="font-propLot">
          <div className="grid gap-[16px] grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4">
            {data?.propLotProfile?.profile.user.userStats &&
              buildProfileCards(data?.propLotProfile?.profile.user.userStats)}
          </div>

          <h2 className="font-londrina text-[38px] text-[#212529] font-normal mt-[48px] sm:mt-[81px]">
            Prop Lot activity
          </h2>

          <div className="mt-[32px] mb-[24px] flex flex-col-reverse sm:flex-row">
            <div className="flex mb-[16px] sm:mt-0 mt-[16px] sm:mb-0">
              {data?.propLotProfile?.tabFilter && (
                <ProfileTabFilters
                  filter={data.propLotProfile.tabFilter}
                  updateFilters={handleUpdateFilters}
                />
              )}
            </div>
            <div className="flex flex-1 justify-end">
              {data?.propLotProfile?.sortFilter && (
                <DropdownFilter
                  filter={data.propLotProfile.sortFilter}
                  updateFilters={handleUpdateFilters}
                />
              )}
            </div>
          </div>

          {data?.propLotProfile?.list?.map(listItem => {
            if (listItem.__typename === 'Idea') {
              return (
                <div className="mb-[16px] space-y-4">
                  <IdeaRow
                    idea={listItem}
                    key={`idea-${listItem.id}`}
                    nounBalance={nounBalanceWithDelegates}
                    disableControls={isAccountOwner}
                  />
                </div>
              );
            }

            return null;
          })}
          {!Boolean(data?.propLotProfile?.list?.length) && (
            <Alert variant="secondary">
              <Alert.Heading>No data found.</Alert.Heading>
              <p>We couldn't find any data for this user!</p>
            </Alert>
          )}
        </div>
      </Col>
    </Section>
  );
};

export default PropLotUserProfile;
