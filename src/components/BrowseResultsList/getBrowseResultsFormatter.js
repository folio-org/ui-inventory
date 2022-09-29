import MissedMatchItem from '../MissedMatchItem';

const getFullMatchRecord = (item, isAnchor) => {
  if (isAnchor) {
    return <strong>{item}</strong>;
  }

  return item;
};

const getBrowseResultsFormatter = (data) => {
  return {
    'title': r => getFullMatchRecord(r.instance?.title, r.isAnchor),
    'subject': r => {
      if (r?.totalRecords) {
        return getFullMatchRecord(r?.subject, r.isAnchor);
      }
      return <MissedMatchItem query={r.subject} />;
    },
    'callNumber': r => {
      if (r?.instance || r?.totalRecords) {
        return getFullMatchRecord(r?.fullCallNumber, r.isAnchor);
      }
      return <MissedMatchItem query={r.fullCallNumber} />;
    },
    'contributor': r => {
      if (r?.totalRecords) {
        return getFullMatchRecord(r?.name, r.isAnchor);
      }
      return <MissedMatchItem query={r.name} />;
    },
    'contributorType': r => data.contributorNameTypes.find(nameType => nameType.id === r.contributorNameTypeId)?.name || '',
    'relatorTerm': r => {
      if (!r.contributorTypeId) {
        return '';
      }

      return r.contributorTypeId.reduce((acc, contributorTypeId) => {
        return [...acc, data.contributorTypes.find(type => type.id === contributorTypeId)?.name || ''];
      }, []).filter(name => !!name).join(', ');
    },
    'numberOfTitles': r => ((r?.instance || r?.totalRecords) || (r?.subject && r?.totalRecords > 0)) && getFullMatchRecord(r?.totalRecords, r.isAnchor),
  };
};

export default getBrowseResultsFormatter;
