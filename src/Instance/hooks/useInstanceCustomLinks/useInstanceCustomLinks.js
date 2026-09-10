import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const renderLink = (instance, link) => {
  return link.replaceAll('{{UUID}}', instance.id)
    .replaceAll('{{HRID}}', instance.hrid)
    .replaceAll('{{indexTitle}}', encodeURI(instance.title));
};

const generateIdFromName = (instance, name) => {
  return name.toLowerCase().replace(/\W/gu, '-') + instance.id;
};

const renderCustomLink = (instance, customLink) => {
  return {
    id: generateIdFromName(instance, customLink.name),
    label: customLink.linkText,
    link: renderLink(instance, customLink.link),
  };
};

const useInstanceCustomLinks = (
  instance,
  { enabled = true } = {},
) => {
  const [namespace] = useNamespace({ key: 'instance-custom-links' });
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      const response = await ky.get('instance-custom-links').json();
      return response.filter(link => link.show);
    },
    enabled: !!enabled,
  });

  return {
    customLinks: data?.map(link => renderCustomLink(instance, link)) || [],
    isLoading,
  };
};

export default useInstanceCustomLinks;
