export default class ApolloConnectedInstance {
  constructor(props, logger) {
    this.props = props;
    this.logger = logger;

    this.obj = props.data.instance;
  }

  instance() {
    const res = this.obj;
    this.logger.log('instance', 'instance:', res);
    return res;
  }
}
