import {
  act,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import '../../test/jest/__mock__';

import {
  renderWithRouter,
  renderWithIntl,
  renderWithFinalForm,
  translationsProperties,
} from '../../test/jest/helpers';

import SubjectFields from './subjectFields';

const renderSubjectFields = () => {
  const component = (
    <SubjectFields
      subjectSources={[{ id: 'sourceId', name: 'sourceName' }]}
      subjectTypes={[{ id: 'typeId', name: 'typeName' }]}
    />
  );

  return renderWithIntl(
    renderWithRouter(renderWithFinalForm(component)),
    translationsProperties,
  );
};

describe('SubjectFields', () => {
  it('should have Add subject button', () => {
    renderSubjectFields();

    expect(screen.getByRole('button', { name: 'Add subject' })).toBeInTheDocument();
  });

  it('should have correct columns', async () => {
    renderSubjectFields();

    const addSubjectButton = screen.getByRole('button', { name: 'Add subject' });

    await act(async () => userEvent.click(addSubjectButton));

    expect(screen.getByText('Subjects')).toBeInTheDocument();
    expect(screen.getByText('Subject source')).toBeInTheDocument();
    expect(screen.getByText('Subject type')).toBeInTheDocument();
  });

  it('should have correct source/type options', async () => {
    renderSubjectFields();

    const addSubjectButton = screen.getByRole('button', { name: 'Add subject' });

    await act(async () => userEvent.click(addSubjectButton));

    expect(screen.getByRole('option', { name: 'sourceName' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'typeName' })).toBeInTheDocument();
  });
});
