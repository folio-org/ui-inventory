import React from 'react';

import stripesFinalForm from '@folio/stripes/final-form';

const renderWithFinalForm = (
  component,
  {
    onSubmit: onCustomSubmit,
    initialValues = {},
    navigationCheck = true,
    enableReinitialize = false,
    ...stripesFinalFormProps
  } = {}
) => {
  const onSubmit = () => {};

  const Form = ({ handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      {component}
    </form>
  );

  const WrappedForm = stripesFinalForm({
    navigationCheck,
    enableReinitialize,
    ...stripesFinalFormProps
  })(Form);

  return (
    <WrappedForm
      onSubmit={onCustomSubmit || onSubmit}
      initialValues={initialValues}
    />
  );
};

export default renderWithFinalForm;
