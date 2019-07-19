import ApplicationFactory from './application';

export default ApplicationFactory.extend({
  records: () => [{
    blockedFields: [
      'hrid',
      'source',
      'statusId',
      'discoverySuppress',
      'staffSuppress',
      'statisticalCode',
      'previouslyHeld',
    ]
  }],
  totalRecords: () => '1',
});
