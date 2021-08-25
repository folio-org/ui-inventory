export default class StripesConnectedInstance {
  constructor(props, logger) {
    this.props = props;
    this.logger = logger;

    const id = this.props.match.params.id;
    const selInstance = this.props.selectedInstance;
    this.obj = (selInstance?.id === id) ? selInstance : null;
  }

  instance() {
    const res = this.obj;
    this.logger.log('instance', 'instance:', res);
    return res;
  }
}
