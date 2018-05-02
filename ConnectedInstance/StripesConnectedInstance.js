export default class StripesConnectedInstance {
  constructor(props, logger) {
    this.props = props;
    this.logger = logger;

    const id = this.props.match.params.id;
    const selInstance = (this.props.resources.selectedInstance || {}).records;
    // Why do we need to do this find?
    this.obj = (selInstance && id) ? selInstance.find(i => i.id === id) : null;
  }

  instance() {
    const res = this.obj;
    this.logger.log('instance', 'instance:', res);
    return res;
  }
}
