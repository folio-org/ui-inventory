import React from 'react';

jest.mock('../../../src/components/InstancePlugin', () => ({ onSelect }) => (
  <button
    id="find-instance"
    onClick={() => onSelect({
      id: '1',
      title: 'new instance',
      publication: [{
        publisher: 'MIT Press',
        dateOfPublication: 'c2004',
      }],
    })}
    type="button"
  >
    +
  </button>
));
