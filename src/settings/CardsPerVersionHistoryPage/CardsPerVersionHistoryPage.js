import { Paneset } from '@folio/stripes/components';

import { CardsPerVersionHistoryPageForm } from './components';

export const CardsPerVersionHistoryPage = () => {
  const initialValues = {
    cardsPerPage: 25,
  };

  return (
    <Paneset id="cardsPerPage">
      <CardsPerVersionHistoryPageForm
        onSubmit={() => {}}
        onCancel={() => {}}
        initialValues={initialValues}
      />
    </Paneset>
  );
};
