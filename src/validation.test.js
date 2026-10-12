import { validateTitles, validateSubInstances, validateDates } from './validation';

describe('validateTitles', () => {
  it('need to add an error to the errors object if title is not defined', () => {
    const instance = { typeTitles: [{ title: '' }] };
    const errors = {};
    const type = 'type';
    const message = 'Title is required';
    validateTitles(instance, type, errors, message);
    expect(errors).toEqual({ typeTitles: [{ title: 'Title is required' }] });
  });
  it('do not add an error to the errors object if title is defined', () => {
    const instance = { typeTitles: [{ title: 'Title' }] };
    const errors = {};
    const type = 'type';
    const message = 'Title is required';
    validateTitles(instance, type, errors, message);
    expect(errors).toEqual({});
  });
});

describe('validateSubInstances', () => {
  it('need to return an array of errors if no instanceRelationshipTypeId is present', () => {
    const instance = { type: [{ instanceRelationshipTypeId: null }] };
    const type = 'type';
    const errors = {};
    const message = 'This field is required';
    validateSubInstances(instance, type, errors, message);
    expect(errors).toEqual({ type: [{ instanceRelationshipTypeId: 'This field is required' }] });
  });

  it('need to return an empty array of errors if instanceRelationshipTypeId is present', () => {
    const instance = { type: [{ instanceRelationshipTypeId: 'instanceRelationshipTypeId' }] };
    const type = 'type';
    const errors = {};
    const message = 'This field is required';
    validateSubInstances(instance, type, errors, message);
    expect(errors).toEqual({});
  });
});
describe('validateDates', () => {
  describe('when dates are empty', () => {
    it('should not return errors', () => {
      const instance = {
        dates: {
          date1: '',
          date2: '',
        },
      };
      const errors = {};
      const message = 'dates length message';

      validateDates(instance, errors, message);
      expect(errors).toEqual({ dates: {} });
    });
  });

  describe('when dates are not empty and not valid', () => {
    it('should return errors', () => {
      const instance = {
        dates: {
          date1: '123',
          date2: '123',
        },
      };
      const errors = {};
      const message = 'dates length message';

      validateDates(instance, errors, message);
      expect(errors).toEqual({
        dates: {
          date1: message,
          date2: message,
        },
      });
    });
  });

  describe('when dates are not empty and valid', () => {
    it('should not return errors', () => {
      const instance = {
        dates: {
          date1: '1234',
          date2: '1234',
        },
      };
      const errors = {};
      const message = 'dates length message';

      validateDates(instance, errors, message);
      expect(errors).toEqual({ dates: {} });
    });
  });
});
