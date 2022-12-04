import config from '../config';
import { useAuth } from './useAuth';

export interface IdeaDiscordNotification {
  index: number;
  title: string;
  tldr: string;
  author: string;
}

export interface CommentDiscordNotification {
  idea_index: number;
  comment_body: string;
  author: string;
}

export interface UpvoteDiscordNotification {
  idea_index: number;
  vote_total: number;
}

export interface DownvoteDiscordNotification {
  idea_index: number;
  vote_total: number;
}

export const useNotifications = () => {
  const HOST = config.app.nounsApiUri;
  const { getAuthHeader } = useAuth();

  const fetcher = async (formData: any) => {
    if (!HOST) {
      throw new Error('API host not defined');
    }
    await fetch(`${HOST}/send-notification`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  };

  const sendNewCommentNotification = async (formData: CommentDiscordNotification) => {
    const type = 'comment-created';
    const subscriberId = 'discord';
    const data = {
      type,
      subscriberId,
      payload: formData,
    };
    fetcher(data);
  };

  const sendNewIdeaNotification = async (formData: IdeaDiscordNotification) => {
    const type = 'idea-created';
    const subscriberId = 'discord';
    const data = {
      type,
      subscriberId,
      payload: formData,
    };
    fetcher(data);
  };

  const sendNewUpvoteNotification = async (formData: UpvoteDiscordNotification) => {
    const type = 'upvote-submitted';
    const subscriberId = 'discord';
    const data = {
      type,
      subscriberId,
      payload: formData,
    };
    fetcher(data);
  };

  const sendNewDownvoteNotification = async (formData: DownvoteDiscordNotification) => {
    const type = 'downvote-submitted';
    const subscriberId = 'discord';
    const data = {
      type,
      subscriberId,
      payload: formData,
    };
    fetcher(data);
  };

  return {
    sendNewCommentNotification,
    sendNewIdeaNotification,
    sendNewUpvoteNotification,
    sendNewDownvoteNotification,
  };
};
