import { useResourcesIds } from '../../hooks';

const withUseResourcesIds = (WrappedComponent) => {
  const WithUseResourcesIds = (props) => {
    const { getResourcesIds } = useResourcesIds();

    return <WrappedComponent getResourcesIds={getResourcesIds} {...props} />;
  };

  WithUseResourcesIds.manifest = WrappedComponent.manifest;

  return WithUseResourcesIds;
};

export { withUseResourcesIds };
