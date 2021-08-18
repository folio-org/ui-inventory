// eslint-disable-next-line
export const piece = {
  id: 'pieceId',
  enumeration: 'en1',
  chronology: '2020 Aug',
  comment: 'Received in Aug',
};

export const receivingHistory = [
  {
    enumeration: 'en2',
    chronology: '2020 Sept',
  },
  { ...piece, source: 'receiving' },
];
