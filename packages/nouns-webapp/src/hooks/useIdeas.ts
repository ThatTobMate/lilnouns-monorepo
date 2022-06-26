import { useState } from 'react';
import { useAuth } from './useAuth';

const HOST = 'http://localhost:5001';

interface IdeaFormData {
  title: string;
  tldr: string;
  description: string;
}

export const useIdeas = () => {
  const { getAuthHeader } = useAuth();
  const [ideas, setIdeas] = useState([]);

  const getIdeas = async () => {
    try {
      const res = await fetch(`${HOST}/ideas`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      const { data } = await res.json();

      if (res.status === 200) {
        setIdeas(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Use to submit an idea
  const submitIdea = async (formData: IdeaFormData) => {
    try {
      const res = await fetch(`${HOST}/ideas`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const { data } = await res.json();
      if (res.status === 200) {
        setIdeas(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    ideas,
    getIdeas,
    submitIdea,
  };
};
