import { InstanceModalsProvider } from '../providers';
import { ViewInstance } from '../Instance/ViewInstance';

const ViewInstanceRoute = (props) => {
  return (
    <InstanceModalsProvider>
      <ViewInstance {...props} />
    </InstanceModalsProvider>
  );
};

export default ViewInstanceRoute;
