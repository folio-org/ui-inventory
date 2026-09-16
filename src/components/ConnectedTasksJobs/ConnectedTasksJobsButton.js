import { ConnectedTasksJobsPlugin, connectedTasksJobsPropTypes } from './ConnectedTasksJobsPlugin';

const ConnectedTasksJobsButton = props => (
  <ConnectedTasksJobsPlugin
    {...props}
    componentType="ConnectedTasksJobsButton"
  />
);

ConnectedTasksJobsButton.propTypes = connectedTasksJobsPropTypes;

export default ConnectedTasksJobsButton;
