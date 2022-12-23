import { validateTitles, validateSubInstances } from './validation';

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
});
