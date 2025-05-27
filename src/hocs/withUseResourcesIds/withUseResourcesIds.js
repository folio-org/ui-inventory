import { useResourcesIds } from '../../hooks';

const withUseResourcesIds = (WrappedComponent) => {
  const WithUseResourcesIds = ({ pollingInterval, ...props }) => {
    const { getResourcesIds } = useResourcesIds(pollingInterval);

    return <WrappedComponent getResourcesIds={getResourcesIds} {...props} />;
  };

  WithUseResourcesIds.manifest = WrappedComponent.manifest;

  return WithUseResourcesIds;
};

export { withUseResourcesIds };
