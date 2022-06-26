import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const IdeaCard = ({ idea }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, description, title } = idea;

  return (
    <div
      className="grid grid-cols-6 gap-y-4 border border-[#e2e3e8] rounded-lg cursor-pointer pt-2 px-3 pb-3"
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="lodrina self-center justify-self-center text-2xl text-[#8C8D92]">
        <span className="mr-4">{id}</span>
        <span>Creator.eth </span>
      </span>
      <span className="text-[#212529] col-span-4 font-bold text-2xl place-self-center lodrina">
        {title}
      </span>
      <div className="flex flex-row justify-end">
        <span className="text-2xl font-bold lodrina self-center justify-end">{0}</span>
        <div className="flex flex-col ml-4">
          <FontAwesomeIcon
            icon={faCaretUp}
            onClick={e => {
              // this prevents the click from bubbling up and opening / closing the hidden section
              e.stopPropagation();
              alert('upvoting');
            }}
            className="text-[#8c8d92] text-2xl"
          />

          <FontAwesomeIcon
            icon={faCaretDown}
            onClick={e => {
              e.stopPropagation();
              alert('downvoting');
            }}
            className="text-[#8c8d92] text-2xl"
          />
        </div>
      </div>
      {isOpen && (
        <>
          <span
            className="border border-[#e2e3e8] bg-[#f4f4f8] p-4 rounded-lg col-span-6"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <span className="col-span-3 font-bold text-sm text-[#8c8d92]">
            creator.eth | 12 lil nouns | 134 votes
          </span>
          <span className="col-span-3 text-[#2b83f6] text-sm font-bold flex justify-end">
            <span>
              See Full Details <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </span>
          </span>
        </>
      )}
    </div>
  );
};

export default IdeaCard;
