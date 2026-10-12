import {
  InstanceModalsProvider,
  OrderManagementProvider,
} from '../providers';
import { ViewInstance } from '../Instance/ViewInstance';

const ViewInstanceRoute = (props) => {
  return (
    <InstanceModalsProvider>
      <OrderManagementProvider>
        <ViewInstance {...props} />
      </OrderManagementProvider>
    </InstanceModalsProvider>
  );
};

export default ViewInstanceRoute;
