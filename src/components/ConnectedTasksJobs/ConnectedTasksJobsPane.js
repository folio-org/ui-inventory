import { ConnectedTasksJobsPlugin, connectedTasksJobsPropTypes } from './ConnectedTasksJobsPlugin';

const ConnectedTasksJobsPane = props => (
  <ConnectedTasksJobsPlugin
    {...props}
    componentType="ConnectedTasksJobsPane"
  />
);

ConnectedTasksJobsPane.propTypes = connectedTasksJobsPropTypes;

export default ConnectedTasksJobsPane;
