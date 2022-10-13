import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';

import { browseModeOptions } from '../../constants';
import MissedMatchItem from '../MissedMatchItem';
import getBrowseResultsFormatter from './getBrowseResultsFormatter';
import userEvent from '@testing-library/user-event';

window.open = jest.fn();

const data = {
  contributorNameTypes: [{ id: 'contributorNameTypeId', name: 'nameType' }],
  contributorTypes: [{ id: 'contributorTypeId', name: 'type' }],
};

describe('getBrowseResultsFormatter', () => {
  describe('Call numbers', () => {
    const {
      callNumber,
      title,
      numberOfTitles,
    } = getBrowseResultsFormatter(data, browseModeOptions.CALL_NUMBERS);

    const row = {
      fullCallNumber: 'A 1958 A 8050',
      shelfKey: '41958 A 48050',
      isAnchor: true,
      totalRecords: 1,
      instance: { id: 'ce9dd893-c812-49d5-8973-d55d018894c4', title: 'Test title' },
    };

    it('should render "callNumber" cell as missed match item', () => {
      expect(callNumber({ fullCallNumber: 'qwerty' })).toEqual(<MissedMatchItem query="qwerty" />);
    });

    it('should render "callNumber" cell as anchor item', () => {
      expect(callNumber(row)).toEqual(<strong>{row.fullCallNumber}</strong>);
    });

    it('should render "callNumber" cell as default item', () => {
      expect(callNumber({ ...row, isAnchor: undefined })).toEqual(row.fullCallNumber);
    });

    it('should render "title" cell', () => {
      expect(title(row)).toEqual(<strong>{row.instance.title}</strong>);
    });

    it('should render "numberOfTitles" cell', () => {
      expect(numberOfTitles(row)).toEqual(<strong>{row.totalRecords}</strong>);
    });
  });

  describe('Contributors', () => {
    beforeEach(() => {
      window.open.mockClear();
    });

    const {
      contributor,
      contributorType,
      relatorTerm,
    } = getBrowseResultsFormatter(data, browseModeOptions.CONTRIBUTORS);

    const row = {
      name: 'Abe, Etsuo, 1949',
      contributorTypeId: ['contributorTypeId'],
      contributorNameTypeId: 'contributorNameTypeId',
      totalRecords: 1,
    };

    it('should render "contributor" cell with connected authority record', () => {
      const FormattedCell = contributor({ ...row, authorityId: 'authorityId' });

      const { getByText } = renderWithIntl(FormattedCell, translationsProperties);

      expect(getByText('Linked to MARC authority')).toBeInTheDocument();
      expect(getByText(row.name)).toBeInTheDocument();
    });

    it('should open the record in MARC authority app in new tab when "authority" icon was clicked', () => {
      const FormattedCell = contributor({ ...row, authorityId: 'authorityId' });

      const { getByTestId } = renderWithIntl(FormattedCell, translationsProperties);

      userEvent.click(getByTestId('authority-app-link'));

      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('/marc-authorities/authorities'), '_blank', 'noopener,noreferrer');
    });

    it('should open the record in MARC authority app in new tab when "authority" enter key was pressed', () => {
      const FormattedCell = contributor({ ...row, authorityId: 'authorityId' });

      const { getByTestId } = renderWithIntl(FormattedCell, translationsProperties);

      userEvent.type(getByTestId('authority-app-link'), '{enter}');

      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('/marc-authorities/authorities'), '_blank', 'noopener,noreferrer');
    });

    it('should render "contributor" cell as missed match item', () => {
      expect(contributor({ name: 'qwerty' })).toEqual(<MissedMatchItem query="qwerty" />);
    });

    it('should render "contributorType" cell', () => {
      expect(contributorType(row)).toEqual(data.contributorNameTypes[0].name);
    });

    it('should render "relatorTerm" cell', () => {
      expect(relatorTerm(row)).toEqual(data.contributorTypes[0].name);
    });
  });

  describe('Subjects', () => {
    const { subject } = getBrowseResultsFormatter(data, browseModeOptions.SUBJECTS);

    const row = {
      isAnchor: true,
      subject: 'Africa Politics and government 20th century',
      totalRecords: 1,
    };

    it('should render "subject" cell as missed match item', () => {
      expect(subject({ subject: 'qwerty' })).toEqual(<MissedMatchItem query="qwerty" />);
    });

    it('should render "subject" cell as anchor item', () => {
      expect(subject(row)).toEqual(<strong>{row.subject}</strong>);
    });
  });
});
